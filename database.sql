CREATE DATABASE MyVocabulary;
USE MyVocabulary;

CREATE TABLE Users (
    PKUser int AUTO_INCREMENT,
    Surname varchar(255),
    Name varchar(255),
    Email varchar(255),
    Password varchar(255),
    PRIMARY KEY (PKUser)
);

CREATE TABLE Lists (
    PKList int AUTO_INCREMENT,
    Title varchar(255),
    FKUser int,
    PRIMARY KEY (PKList),
    FOREIGN KEY (FKUser) REFERENCES Users(PKUser) ON DELETE CASCADE
);

CREATE TABLE Terms (
    PKTerm int AUTO_INCREMENT,
    Word varchar(255),
    ForeignWord varchar(255),
    FKList int,
    PRIMARY KEY (PKTerm),
    FOREIGN KEY (FKList) REFERENCES Lists(PKList) ON DELETE CASCADE
);

CREATE TABLE Friendship (
    PKFriendship int AUTO_INCREMENT,
    FKUser1 int,
    FKUser2 int,
    PRIMARY KEY (PKFriendship),
    FOREIGN KEY (FKUser1) REFERENCES Users(PKUser) ON DELETE CASCADE,
    FOREIGN KEY (FKUser2) REFERENCES Users(PKUser) ON DELETE CASCADE
)
