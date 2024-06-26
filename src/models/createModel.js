import { db } from "../app.js";

export function createForm(title, choices) {
  try {
    const parsedChoices = JSON.parse(choices);
    const votes = {};
    for (const index in parsedChoices) {
      votes[index] = 0;
    }

    // Will create the form whilst updating the many-to-many junction table
    const userList = db
      .prepare("SELECT id FROM users")
      .all()
      .map((row) => row.id);
    const formQuery = db.prepare(
      `INSERT INTO forms (title, choices, votes) VALUES (?, ?, ?)`
    );
    const junctionQuery = db.prepare(
      `INSERT INTO userJunctionForm (user_id, form_id, voted) VALUES (?, ?, 0)`
    );

    const transaction = db.transaction(() => {
      const insertedRow = formQuery.run(title, choices, JSON.stringify(votes));
      for (const user_id of userList) {
        junctionQuery.run(user_id, insertedRow.lastInsertRowid);
      }
    });
    transaction();
    console.log(`Form ${title}, has been created.`);
    return;
  } catch (err) {
    console.error(`Error ${err.code}: ${err.message}`);
    throw err;
  }
}

export function createUser(name, token, votes) {
  try {
    const formArray = db
      .prepare("SELECT id FROM forms")
      .all()
      .map((row) => row.id);

    // Will create the form whilst updating the many-to-many junction table
    const userQuery = db.prepare(
      `INSERT INTO users (name, token, votes) VALUES (?, ?, ?)`
    );
    const junctionQuery = db.prepare(
      `INSERT INTO userJunctionForm (user_id, form_id, voted) VALUES (?, ?, 0)`
    );

    const transaction = db.transaction(() => {
      const insertedRow = userQuery.run(name, token.toString(), votes);
      console.log("insertedRow", insertedRow);
      for (const form_id of formArray) {
        junctionQuery.run(insertedRow.lastInsertRowid, form_id);
      }
    });
    transaction();
    console.log(`User ${name} has been created.`);
    return;
  } catch (err) {
    console.error(`Error ${err.code}: ${err.message}`);
    throw err;
  }
}

export function deleteUser(user_id) {
  try {
    const userQuery = db.prepare("DELETE FROM users WHERE id=?");
    const junctionQuery = db.prepare(
      "DELETE FROM userJunctionForm WHERE user_id=?"
    );

    const transaction = db.transaction(() => {
      userQuery.run(user_id);
      junctionQuery.run(user_id);
    });
    transaction();
    console.log(`User ${user_id} has been deleted.`);
    return;
  } catch (err) {
    console.error(`Error ${err.code}: ${err.message}`);
    throw err;
  }
}

export function deleteForm(form_id) {
  try {
    const formQuery = db.prepare("DELETE FROM forms WHERE id=?");
    const junctionQuery = db.prepare(
      "DELETE FROM userJunctionForm WHERE form_id=?"
    );

    const transaction = db.transaction(() => {
      formQuery.run(form_id);
      junctionQuery.run(form_id);
    });
    transaction();
    console.log(`Form ${form_id} has been deleted.`);
    return;
  } catch (err) {
    console.error(`Error ${err.code}: ${err.message}`);
    throw err;
  }
}
