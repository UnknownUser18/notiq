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
    - `uuid`: Unique identifier for the user, used for authentication.
- **Constraints**:
    - `id` is unsigned.
- **Indexes**:
  - `id` is the primary key.
  - `uuid` is unique.
- **Relationships**: None.
- **Example Data**:

| id | username | password        | uuid                                 |
|----|----------|-----------------|--------------------------------------|
| 1  | habibi   | cometopoland123 | abcd1234-5678-90ab-cdef-1234567890ab |
| 2  | yogurt   | sybau           | efgh5678-90ab-cdef-1234-567890abcdef |
