type PersistPayload = {
  kind: "event" | "chat";
  body: Record<string, unknown>;
};

export const persistRecord = (payload: PersistPayload) => {
  const mode = process.env.PERSISTENCE_MODE ?? "none";
  if (mode !== "sqlite") return;

  try {
    // Optional dependency. App runs if not installed.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Database = require("better-sqlite3");
    const db = new Database(process.env.SQLITE_PATH ?? "./utility-demo.db");
    db.prepare(
      "CREATE TABLE IF NOT EXISTS demo_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT, body TEXT, created_at TEXT)"
    ).run();
    db.prepare("INSERT INTO demo_logs(kind, body, created_at) VALUES (?, ?, ?)").run(
      payload.kind,
      JSON.stringify(payload.body),
      new Date().toISOString()
    );
    db.close();
  } catch {
    // Fail silently to keep demo app free to run.
  }
};
