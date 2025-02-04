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
        self.cursor.execute("SELECT * FROM users;")
        return self.cursor.fetchall()
        
    def close(self):
        if self.verify_connection():
            self.connection.close()
            print("DB Connection Closed")



