const spicedPG = require("spiced-pg");

//PFAD!!
const db = spicedPG(
    process.env.DATABASE_URL ||
        "postgres:bennidorp:postgres@localhost:5432/social"
);

exports.getLastMessages = () => {
    return db.query(
        `
            SELECT *
            FROM (
                     SELECT
                         chat_messages.id AS message_id, *
                     FROM
                         chat_messages
                             JOIN users
                                  ON(chat_messages.user_id = users.id)
                     ORDER BY
                         chat_messages.id DESC
                     LIMIT 10
                 ) as subquery
            ORDER BY message_id ASC;
    `
    );
};

exports.addMessage = (user_id, message_text) => {
    return db.query(
        `
    INSERT INTO 
        chat_messages
        (user_id, message_text)
    VALUES 
        ($1,$2)
    RETURNING 
        *
    `,
        [user_id, message_text]
    );
};
