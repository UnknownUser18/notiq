# Database

## What is this file about?

This file provides an overview of the database structure and its components used in the project. It includes details
about the tables, their relationships, and any relevant constraints or indexes.

## Database Structure

The database is structured into several tables, each serving a specific purpose. Below is a brief description of each
table:

### Users Table

- **Table Name**: `users`
- **Purpose**: Stores user information.
- **Columns**:
    - `id`: Unique identifier for each user (Primary Key).
    - `username`: Unique username for the user.
    - `password`: Hashed password for user authentication (not hashed yet).
- **Constraints**:
    - `id` is unsigned.
- **Indexes** - None (other than the primary key).
- **Relationships**: None.
- **Example Data**:

| id | username | password        |
|----|----------|-----------------|
| 1  | habibi   | cometopoland123 |
| 2  | yogurt   | sybau           |
