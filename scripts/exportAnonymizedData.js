#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import process from 'node:process'

const [consentsFile, historyFile] = process.argv.slice(2)

if (!consentsFile || !historyFile) {
  console.error('Usage: node scripts/exportAnonymizedData.js <consents.json> <taskHistory.json>')
  process.exit(1)
}

const readJson = (filePath) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error.message)
    process.exit(1)
  }
}

const normaliseFirestoreValue = (value) => {
  if (value == null) return null
  if (typeof value !== 'object') return value
  if ('stringValue' in value) return value.stringValue
  if ('doubleValue' in value) return Number(value.doubleValue)
  if ('integerValue' in value) return Number(value.integerValue)
  if ('booleanValue' in value) return Boolean(value.booleanValue)
  if ('timestampValue' in value) return value.timestampValue
  if ('arrayValue' in value) {
    const values = value.arrayValue.values || []
    return values.map(normaliseFirestoreValue)
  }
  if ('mapValue' in value) {
    const obj = {}
    const fields = value.mapValue.fields || {}
    Object.entries(fields).forEach(([key, nestedValue]) => {
      obj[key] = normaliseFirestoreValue(nestedValue)
    })
    return obj
  }
  return value
}

const normaliseFirestoreDoc = (doc) => {
  if (!doc) return {}
  if (doc.fields) {
    const normalised = {}
    Object.entries(doc.fields).forEach(([key, value]) => {
      normalised[key] = normaliseFirestoreValue(value)
    })
    return normalised
  }
  return doc
}

const loadCollection = (rawData) => {
  if (Array.isArray(rawData)) {
    return rawData.map(normaliseFirestoreDoc)
  }
  if (rawData && Array.isArray(rawData.documents)) {
    return rawData.documents.map((document) => normaliseFirestoreDoc(document))
  }
  return []
}

const consents = loadCollection(readJson(consentsFile))
const history = loadCollection(readJson(historyFile))

const consentByUid = new Map()
consents.forEach((entry) => {
  if (!entry.uid) return
  consentByUid.set(entry.uid, {
    optedIn: entry.optedIn ?? false,
    locale: entry.locale ?? 'unknown',
    earningsFocus: entry.earningsFocus ?? 'unknown',
    updatedAt: entry.updatedAt ?? entry.updated_at ?? null,
  })
})

const aggregate = {}

history.forEach((entry) => {
  const uid = entry.uid || 'anonymous'
  const country = entry.country || 'unspecified'
  const focus = entry.taskType || entry.focusArea || 'general'
  const key = `${country}__${focus}`
  const reward = Number(entry.rewardValue ?? entry.reward_value ?? 0) || 0

  if (!aggregate[key]) {
    aggregate[key] = {
      country,
      focus,
      totalUsers: new Set(),
      totalTasks: 0,
      totalRewards: 0,
      jackpotHits: 0,
    }
  }

  const bucket = aggregate[key]
  bucket.totalTasks += 1
  bucket.totalRewards += reward
  bucket.totalUsers.add(uid)
  if ((entry.rewardLabel || '').toLowerCase().includes('jackpot')) {
    bucket.jackpotHits += 1
  }
})

const rows = []

Object.values(aggregate).forEach((bucket) => {
  rows.push({
    country: bucket.country,
    focus: bucket.focus,
    unique_users: bucket.totalUsers.size,
    tasks_completed: bucket.totalTasks,
    total_rewards_usd: bucket.totalRewards.toFixed(2),
    jackpot_hits: bucket.jackpotHits,
  })
})

const consentRows = []
consentByUid.forEach((value, uid) => {
  consentRows.push({
    uid,
    opted_in: value.optedIn,
    locale: value.locale,
    earnings_focus: value.earningsFocus,
    updated_at: value.updatedAt,
  })
})

const toCsv = (data) => {
  if (!data.length) return ''
  const headers = Object.keys(data[0])
  const lines = [headers.join(',')]
  data.forEach((row) => {
    const values = headers.map((header) => {
      const cell = row[header] ?? ''
      if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
        return `"${cell.replace(/"/g, '""')}"`
      }
      return cell
    })
    lines.push(values.join(','))
  })
  return lines.join('\n')
}

const outputDir = path.join(process.cwd(), 'exports')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

fs.writeFileSync(path.join(outputDir, 'winwealth-anonymized.csv'), toCsv(rows), 'utf-8')
fs.writeFileSync(path.join(outputDir, 'winwealth-consents.csv'), toCsv(consentRows), 'utf-8')

console.log('Export complete → exports/winwealth-anonymized.csv & exports/winwealth-consents.csv')
