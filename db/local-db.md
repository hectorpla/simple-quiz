# isntall psql
https://www.saltycrane.com/blog/2019/01/how-run-postgresql-docker-mac-local-development/

# docker
docker exec -it my_postgres psql -U postgres -c "create database my_database"

# psql cli
psql -h localhost -p 54320 -d my_database -U postgres


# DB tables

CREATE TABLE contestuser (
  email varchar(200) PRIMARY KEY,
  created_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE question (
  id serial PRIMARY KEY,
  created_on TIMESTAMP DEFAULT NOW(),
  text_en varchar(500)
);

CREATE TABLE options (
  id serial PRIMARY KEY, 
  question_id integer,
  text_en varchar(100),
  is_correct boolean NOT NULL,
  created_on TIMESTAMP DEFAULT NOW(),
  CONSTRAINT options_question_id_fkey FOREIGN KEY (question_id)
    REFERENCES question (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE user_answer (
  user_id varchar(200),
  question_id integer,
  point integer,
  PRIMARY KEY (user_id, question_id),
  CONSTRAINT user_answer_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES contestuser (email) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT user_answer_question_id_fkey FOREIGN KEY (question_id)
    REFERENCES question (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
);

## insert
INSERT INTO question (text_en) VALUES
('What natural phenomena are measured by the Richter scale?'),
('What is the most spoken language in the world?'),
('In 2000, which artist(s) tied Michael Jacksons 1984 record of winning eight Grammys in a single year?'),
('Who wrote the famous Harry Potter series of books?'),
('Which is the most abundant metal in the earths crust?');

INSERT INTO options (text_en, question_id, is_correct) VALUES
('earthquakes', 3, TRUE),
('rain', 3, FALSE);

# select
SELECT text_en from question;