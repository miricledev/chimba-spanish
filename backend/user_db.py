import psycopg2
from dataclasses import dataclass
import bcrypt
import json  # add this at the top of user_db.py




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
            user_row = self.verify_user_exists(email)
            if user_row:
                stored_hash = user_row[4]
                if bcrypt.checkpw(password.encode(), bytes(stored_hash)):
                    return True

                else:
                    raise Exception("Incorrect password")
            else:
                raise Exception("No account with this email exists")

            
                
    def verify_user_exists(self, email):
        self.cursor.execute("""
            SELECT user_id, firstname, lastname, email, password, account_type
            FROM users
            WHERE email = %s;
        """, (email,))
        
        user = self.cursor.fetchone()
        
        if user:
            print(user, flush=True)
            return user
        return False


    
    
    
    def get_all_rows(self):
        if self.verify_connection():
            self.cursor.execute("SELECT (user_id, firstname, lastname, account_type) FROM users;")
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
                inserted = self.insert_into_inbox(room_id, sender_id, receiver_id, message_content)
                return inserted
            except Exception as e:
                raise Exception(e)
                
    def insert_into_inbox(self, room_id, user1_id, user2_id, last_message):
        if self.verify_connection():
            if not self.check_inbox_exists(room_id):
                query = "INSERT INTO inbox (room_id, user_id, receiver_id, last_message) VALUES (%s, %s, %s, %s);"
                values = (room_id, user1_id, user2_id, last_message)
                try:
                    self.cursor.execute(query, values)
                    self.connection.commit()
                    return True
                except Exception as e:
                    raise Exception(e)
            else:
                # Room exists → Update last_message
                update_query = "UPDATE inbox SET last_message = %s WHERE room_id = %s;"
                update_values = (last_message, room_id)
                try:
                    self.cursor.execute(update_query, update_values)
                    self.connection.commit()
                    return True
                except Exception as e:
                    raise Exception(e)

                
            
    def get_all_inboxes(self, user_id):
        if self.verify_connection():
            query = "SELECT * FROM inbox WHERE user_id = %s OR receiver_id = %s;"
            value = (user_id, user_id)
            try:
                self.cursor.execute(query, value)
                all_inboxes = self.cursor.fetchall()
                print(all_inboxes, flush=True)
                return all_inboxes
            except Exception as e:
                raise Exception(e)
        
    def check_inbox_exists(self, room_id):
        if self.verify_connection():
            query = "SELECT 1 FROM inbox WHERE room_id = %s;"
            room = (room_id,)
            try:
                self.cursor.execute(query, room)
                exists = self.cursor.fetchone()
                if exists:
                    return True
                else:
                    return False
            except Exception as e:
                raise Exception(e)
            
    def insert_post(self, author_id, title, description, image_url=None):
        if self.verify_connection():
            query = """
                INSERT INTO posts (author_id, title, description, image_url)
                VALUES (%s, %s, %s, %s);
            """
            values = (author_id, title, description, image_url)
            try:
                self.cursor.execute(query, values)
                self.connection.commit()
                return True
            except Exception as e:
                raise Exception(e)
            
    def get_all_posts(self):
        if self.verify_connection():
            query = """
                SELECT post_id, author_id, title, description, image_url, like_count, comment_count, date_posted
                FROM posts
                ORDER BY date_posted DESC;
            """
            try:
                self.cursor.execute(query)
                posts = self.cursor.fetchall()
                # Format posts into a list of dicts
                posts_list = []
                for post in posts:
                    posts_list.append({
                        "post_id": post[0],
                        "author_id": post[1],
                        "title": post[2],
                        "description": post[3],
                        "image_url": post[4],
                        "like_count": post[5],
                        "comment_count": post[6],
                        "date_posted": post[7].isoformat()  # Converts timestamp to readable format
                    })
                return posts_list
            except Exception as e:
                raise Exception(e)
            
    def insert_user_course(self, user_id, course_id):
        if self.verify_connection:
            self.cursor.execute("SELECT * FROM users WHERE user_id = %s;", (user_id,))
            if self.cursor.fetchone():
                self.cursor.execute("SELECT * FROM courses WHERE course_id = %s;", (course_id,))
                if self.cursor.fetchone():
                    query = """
                        INSERT INTO user_courses(user_id, course_id)
                        VALUES (%s, %s)
                        ON CONFLICT (user_id, course_id) DO NOTHING;
                    """
                    self.cursor.execute(query, (user_id, course_id))
                    self.connection.commit()
                else:
                    raise Exception("Course with this id does not exist")
            else:
                raise Exception("User with this id does not exist")
            
            
    def get_user_course_ids(self, user_id):
        if self.verify_connection:
            self.cursor.execute("SELECT * FROM users WHERE user_id = %s;", (user_id,))
            if not self.cursor.fetchone():
                raise Exception("User with this id does not exist")

            self.cursor.execute("""
                SELECT course_id
                FROM user_courses
                WHERE user_id = %s;
            """, (user_id,))
            rows = self.cursor.fetchall()

            return [row[0] for row in rows]  # return just course_id values
        
        

    def insert_new_lesson(self, data):
        if not self.verify_connection:
            raise Exception("No database connection")

        try:
            self.connection.rollback()  # In case the previous transaction failed

            # Extract lesson metadata
            course_id = data['courseId']
            teacher_id = data['teacherId']
            lesson = data['lesson']

            title = lesson['title']
            level = lesson['level']
            objective = lesson['objective']
            video_url = lesson['videoURL']
            audio_url = lesson['audioURL']
            cultural_note = lesson['culturalNote']
            written_exercise = lesson['writtenExercise']
            section_name = lesson['section']

            # Get section_id from sections table
            self.cursor.execute("SELECT section_id FROM sections WHERE title = %s AND course_id = %s;", (section_name, course_id))
            section_row = self.cursor.fetchone()
            if not section_row:
                raise Exception(f"Section '{section_name}' not found in course {course_id}.")
            section_id = section_row[0]

            # Insert lesson
            self.cursor.execute("""
                INSERT INTO lessons (course_id, teacher_id, title, level, section_id, objective, video_url, audio_url, cultural_note, written_exercise)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING lesson_id;
            """, (course_id, teacher_id, title, level, section_id, objective, video_url, audio_url, cultural_note, written_exercise))
            lesson_id = self.cursor.fetchone()[0]

            for item in lesson['dialogue']:
                if item['type'] == 'message':
                    self.cursor.execute("""
                        INSERT INTO lesson_dialogue (lesson_id, type, speaker, text)
                        VALUES (%s, %s, %s, %s);
                    """, (
                        lesson_id,
                        'message',
                        item.get('speaker'),
                        item.get('text')
                    ))
                elif item['type'] == 'question':
                    self.cursor.execute("""
                        INSERT INTO lesson_dialogue (lesson_id, type, text, options, correct_option)
                        VALUES (%s, %s, %s, %s, %s);
                    """, (
                        lesson_id,
                        'question',
                        item.get('text'),
                        item.get('options', []),  # Already a list, PostgreSQL text[] accepts Python lists
                        item.get('correctOption')
                    ))
                else:
                    raise Exception(f"Unknown dialogue type: {item['type']}")


            # Insert vocabulary
            for v in lesson['vocabulary']:
                self.cursor.execute("""
                    INSERT INTO lesson_vocabulary (lesson_id, term, meaning)
                    VALUES (%s, %s, %s);
                """, (lesson_id, v['term'], v['meaning']))

            # Insert one quiz per lesson
            self.cursor.execute("""
                INSERT INTO quizzes (lesson_id, title)
                VALUES (%s, %s)
                RETURNING quiz_id;
            """, (lesson_id, 'Main Quiz'))

            quiz_id = self.cursor.fetchone()[0]

            # Now insert each quiz question into quiz_questions
            for q in lesson['quiz']:
                self.cursor.execute("""
                    INSERT INTO quiz_questions (
                        quiz_id, type, question, correct_answer,
                        blocks, options, pairs, audio_url, image_url
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
                """, (
                    quiz_id,
                    q['type'],
                    q.get('question'),
                    str(q.get('correctAnswer')) if q.get('correctAnswer') is not None else None,
                    q.get('blocks'),  # array of strings
                    q.get('options'),  # array of strings
                    json.dumps(q.get('pairs')) if q.get('pairs') else None,  # JSONB
                    q.get('audioURL'),
                    q.get('imageURL')
                ))

            self.connection.commit()
            
        except Exception as e:
                self.connection.rollback()
                raise Exception(f"Error inserting lesson: {str(e)}")
            
            
    def get_lessons_by_course(self, course_id):
        if not self.verify_connection:
            raise Exception("No database connection")
        
        self.cursor.execute("""
            SELECT l.lesson_id, l.title, l.level, l.objective, l.video_url, s.title AS section_title
            FROM lessons l
            JOIN sections s ON l.section_id = s.section_id
            WHERE l.course_id = %s;
        """, (course_id,))
        
        rows = self.cursor.fetchall()
        columns = [desc[0] for desc in self.cursor.description]
        return [dict(zip(columns, row)) for row in rows]
    
    def delete_lesson(self, lesson_id):
        if not self.verify_connection:
            raise Exception("No database connection")
        self.cursor.execute("DELETE FROM lessons WHERE lesson_id = %s;", (lesson_id,))
        self.connection.commit()










            
            
        
    def close(self):
        if self.verify_connection():
            self.connection.close()
            print("DB Connection Closed")



