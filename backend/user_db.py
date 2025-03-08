import asyncpg
from dataclasses import dataclass
import bcrypt
from typing import Optional, List, Tuple

@dataclass
class DatabaseConfiguration:
    database: str
    host: str
    user: str
    password: str
    port: str

class DBHandler:
    def __init__(self, configuration: DatabaseConfiguration):
        self.configuration = configuration
        self.pool = None

    async def connect(self):
        """Initialize asyncpg connection pool"""
        try:
            self.pool = await asyncpg.create_pool(
                database=self.configuration.database,
                host=self.configuration.host,
                user=self.configuration.user,
                password=self.configuration.password,
                port=self.configuration.port
            )
        except Exception as error:
            raise Exception(f"Error connecting to the database: {error}")

    async def close(self):
        """Close the database connection pool"""
        if self.pool:
            await self.pool.close()
            print("DB Connection Closed")

    async def register_new_user(self, email: str, first_name: str, last_name: str, password: bytes, phone_number: str):
        """Register a new user with hashed password"""
        async with self.pool.acquire() as conn:
            if await self.verify_user_exists(email):
                raise Exception("A user with this email already exists")
            
            query = """
                INSERT INTO users (firstname, lastname, email, password, phonenumber) 
                VALUES ($1, $2, $3, $4, $5);
            """
            await conn.execute(query, first_name, last_name, email, password, phone_number)

    async def verify_user_login(self, email: str, password: str) -> bool:
        """Check if user exists and validate password"""
        user_row = await self.verify_user_exists(email)
        if user_row:
            stored_password = user_row[4]  # assuming password is at index 4
            if bcrypt.checkpw(password.encode(), stored_password):
                return True
            raise Exception("Incorrect password")
        raise Exception("No account with this email exists")

    async def verify_user_exists(self, email: str) -> Optional[Tuple]:
        """Check if a user exists by email"""
        async with self.pool.acquire() as conn:
            query = "SELECT * FROM users WHERE email = $1;"
            user = await conn.fetchrow(query, email)
            return user

    async def get_all_rows(self) -> List[Tuple]:
        """Get all users"""
        async with self.pool.acquire() as conn:
            query = "SELECT user_id, firstname, lastname FROM users;"
            rows = await conn.fetch(query)
            return [tuple(row) for row in rows]

    async def insert_new_flashcards(self, user_id: int, term: str, definition: str):
        """Insert a new flashcard"""
        async with self.pool.acquire() as conn:
            user_exists = await conn.fetchrow("SELECT 1 FROM users WHERE user_id = $1;", user_id)
            if not user_exists:
                raise Exception("User with this ID does not exist")
            
            query = "INSERT INTO flashcards (user_id, term, definition) VALUES ($1, $2, $3);"
            await conn.execute(query, user_id, term, definition)

    async def get_all_flashcards(self, user_id: int) -> List[Tuple[str, str]]:
        """Retrieve all flashcards for a user"""
        async with self.pool.acquire() as conn:
            query = "SELECT term, definition FROM flashcards WHERE user_id = $1;"
            flashcards = await conn.fetch(query, user_id)
            if not flashcards:
                raise Exception("There are no flashcards")
            return [(row["term"], row["definition"]) for row in flashcards]

    async def get_chat_log(self, room_id: int) -> Optional[List[Tuple]]:
        """Retrieve chat history for a room"""
        async with self.pool.acquire() as conn:
            query = "SELECT * FROM messages WHERE room_number = $1 ORDER BY datetime_sent ASC;"
            messages = await conn.fetch(query, room_id)
            return [tuple(row) for row in messages] if messages else None

    async def get_unread_messages(self, user_id: int) -> Optional[List[Tuple]]:
        """Retrieve unread messages for a user"""
        async with self.pool.acquire() as conn:
            query = "SELECT * FROM messages WHERE receiver_id = $1 AND receiver_read_message = false;"
            unread_messages = await conn.fetch(query, user_id)
            return [tuple(row) for row in unread_messages] if unread_messages else None

    async def read_message(self, user_id: int):
        """Mark all messages as read for a user"""
        async with self.pool.acquire() as conn:
            query = "UPDATE messages SET receiver_read_message = true WHERE receiver_id = $1;"
            await conn.execute(query, user_id)

    async def add_message(self, sender_id: int, room_id: int, receiver_id: int, message_content: str):
        """Add a new chat message"""
        async with self.pool.acquire() as conn:
            query = """
                INSERT INTO messages (sender_id, receiver_id, room_number, message_contents) 
                VALUES ($1, $2, $3, $4);
            """
            await conn.execute(query, sender_id, receiver_id, room_id, message_content)
