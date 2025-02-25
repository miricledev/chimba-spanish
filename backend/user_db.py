import psycopg2
from dataclasses import dataclass
import bcrypt



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
        self.connection = None
        self.cursor = None
        
        
    
    def connect(self):
        try:
            self.connection = psycopg2.connect(
                database=self.configuration.database,
                host=self.configuration.host,
                user=self.configuration.user,
                password=self.configuration.password,
                port=self.configuration.port
            )
            
            self.cursor = self.connection.cursor()
        except Exception as error:
            raise Exception(f'Error connecting to the database: {error}')
        
        
            
    # Use before any database operation
    def verify_connection(self):
        if self.connection and self.cursor:
            return True
        return False
    
    
            
    def register_new_user(self, email, first_name, last_name, password, phone_number):
        if self.verify_connection():
            # Check if user with this email already exists
            if not self.verify_user_exists(email):
                # Check all fields are valid otherwise raise error indicating missing field
                if all(locals().values()):
                    query = "INSERT INTO users (firstname, lastname, email, password, phonenumber) VALUES (%s, %s, %s, %s, %s);"
                    values = (first_name, last_name, email, password, phone_number)
                    try:
                        self.cursor.execute(query, values)
                        self.connection.commit()
                    except Exception as e:
                        raise Exception(f'Error in registration despite all fields being filled: {e}')
                else:
                    raise Exception("Missing empty fields")
            else:
                raise Exception("A user with this email address already exists")
            
            
        
    def verify_user_login(self, email, password):
        if self.verify_connection():
            # Check where email exists in db and compare with password at given row
            user_row = self.verify_user_exists(email)
            if user_row:
                #comparing the encrypted password with the entered one with bcrypt
                if bcrypt.checkpw(password.encode(), user_row[4].tobytes()):
                    return True
                else:
                    raise Exception("Incorrect password")
            else:
                raise Exception("No account with this email exists")
            
            
        
    def verify_user_exists(self, email):
        self.cursor.execute("SELECT * FROM users WHERE email = %s;", (email,))
        user = self.cursor.fetchone()
        if user:
            return user
        return False
    
    
    
    def get_all_rows(self):
        if self.verify_connection():
            self.cursor.execute("SELECT (user_id, firstname, lastname) FROM users;")
            return self.cursor.fetchall()
        
        
    
    def insert_new_flashcards(self, user_id, term, definition):
        if self.verify_connection:
            self.cursor.execute("SELECT * FROM users WHERE user_id = %s;", (user_id,))
            if self.cursor.fetchone():
                query = "INSERT INTO flashcards(user_id, term, definition) VALUES (%s, %s, %s);"
                values = (user_id, term, definition)
                self.cursor.execute(query, values)
                self.connection.commit()
            else:
                raise Exception("User with this id does not exist")
            
            
            
    def get_all_flashcards(self, user_id):
        if self.verify_connection():
            self.cursor.execute("SELECT (term, definition) FROM flashcards WHERE user_id = %s;", (user_id,))
            flashcards = self.cursor.fetchall()
            if flashcards:
                return flashcards
            else:
                raise Exception("There are no flashcards")
            
            
            
    # Run when user enters a chat to receive message history
    def get_chat_log(self, room_id):
        if self.verify_connection():
            try:
                self.cursor.execute("SELECT * FROM messages WHERE room_number = %s ORDER BY datetime_sent ASC;", (room_id,))
                messages = self.cursor.fetchall()
                if messages:
                    return messages
                else:
                    return False
            except Exception as e:
                raise Exception(e)
            
            
            
    # Used for notifying users if there are unread messages
    def get_unread_messages(self, user_id):
        if self.verify_connection():
            try: 
                self.cursor.execute("SELECT * FROM messages WHERE receiver_id = %s AND receiver_read_message = false;", (user_id,))
                unread_messages = self.cursor.fetchall()
                if unread_messages:
                    return unread_messages
                else:
                    return False
            except Exception as e:
                raise Exception(e)
            
            
            
    # Used to set a received message to 'seen'
    def read_message(self, user_id):
        if self.verify_connection():
            try:
                self.cursor.execute("UPDATE messages SET receiver_read_message = true WHERE receiver_id = %s;", (user_id,))
                self.connection.commit()
            except Exception as e:
                raise Exception(e)
            
            
            
    def add_message(self, sender_id, room_id, receiver_id, message_content):
        if self.verify_connection():
            query = "INSERT INTO messages (sender_id, receiver_id, room_number, message_contents) VALUES (%s, %s, %s, %s);"
            values = (sender_id, receiver_id, room_id, message_content)
            try:
                self.cursor.execute(query, values)
                self.connection.commit()
            except Exception as e:
                raise Exception(e)
            
            
        
    def close(self):
        if self.verify_connection():
            self.connection.close()
            print("DB Connection Closed")



