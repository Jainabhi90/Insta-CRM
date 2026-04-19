import fs from "node:fs"
import path from "node:path"
import { DatabaseSync } from "node:sqlite"

const [, , databasePath, workflowJsonPath, workflowNameArg] = process.argv

if (!databasePath || !workflowJsonPath) {
  console.error(
    "Usage: node scripts/sync-local-n8n-workflow.mjs <n8n-sqlite-path> <workflow-json-path> [workflow-name]",
  )
  process.exit(1)
}

const resolvedDatabasePath = path.resolve(databasePath)
const resolvedWorkflowPath = path.resolve(workflowJsonPath)
const workflowName = workflowNameArg || "Comment Listener - Complete"

const workflowRaw = fs.readFileSync(resolvedWorkflowPath, "utf8")
const workflow = JSON.parse(workflowRaw)

const db = new DatabaseSync(resolvedDatabasePath)

try {
  const row = db
    .prepare("select id, name from workflow_entity where name = ? limit 1")
    .get(workflowName)

  if (!row) {
    console.error(`Workflow '${workflowName}' was not found in ${resolvedDatabasePath}.`)
    process.exit(1)
  }

  db.prepare(
    `
      update workflow_entity
      set
        nodes = ?,
        connections = ?,
        settings = ?,
        updatedAt = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')
      where id = ?
    `,
  ).run(
    JSON.stringify(workflow.nodes || []),
    JSON.stringify(workflow.connections || {}),
    JSON.stringify(workflow.settings || {}),
    row.id,
  )

  console.log(`Updated workflow '${row.name}' (${row.id}) from ${resolvedWorkflowPath}`)
} finally {
  db.close()
}
