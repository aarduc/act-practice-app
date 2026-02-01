exports.up = (pgm) => {
  pgm.createTable("users", {
    id: "id",
    email: { type: "text", notNull: true, unique: true },
    password_hash: { type: "text", notNull: true },
    role: { type: "text", notNull: true },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("now()") },
  });

  pgm.addConstraint("users", "users_role_check", {
    check: "role IN ('student', 'teacher')",
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
