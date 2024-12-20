// Import required modules
import * as fs from 'fs/promises';
import * as readline from 'readline';
import { createHash } from 'crypto';

// Enum definition for commands
enum Command {
    Add = 'Adding',
    Delete = 'Deleting',
    Update = 'Updating',
    Quit = 'Quit'
}

// User interface
type User = {
    userId: string;
    username: string;
    userpassword: string;
};

// Utility function to read users.json file
async function readUsersFile(filePath: string): Promise<User[]> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
            // File doesn't exist, return an empty array
            return [];
        }
        throw err;
    }
}

// Utility function to write to users.json file
async function writeUsersFile(filePath: string, users: User[]): Promise<void> {
    try {
        await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error writing to users.json:', err);
    }
}

// Function to process commands
async function processCommand(command: string, users: User[], filePath: string): Promise<string> {
    const addRegex = /^Adding\s+(\S+)\s+(\S+)\s+(\S+)$/;
    const deleteRegex = /^Deleting\s+(\S+)$/;
    const updateRegex = /^Updating\s+(\S+)\s+(\S+)\s+(\S+)$/;

    if (addRegex.test(command)) {
        const [, userId, username, userpassword] = command.match(addRegex)!;
        if (users.some(user => user.userId === userId)) {
            return `Error: User with ID ${userId} already exists.`;
        }
        const hashedPassword = hashPassword(userpassword);
        users.push({ userId, username, userpassword: hashedPassword });
        await writeUsersFile(filePath, users);
        return 'User added successfully.';
    } else if (deleteRegex.test(command)) {
        const [, userId] = command.match(deleteRegex)!;
        const index = users.findIndex(user => user.userId === userId);
        if (index === -1) {
            return `Error: User with ID ${userId} does not exist.`;
        }
        users.splice(index, 1);
        await writeUsersFile(filePath, users);
        return 'User deleted successfully.';
    } else if (updateRegex.test(command)) {
        const [, userId, username, userpassword] = command.match(updateRegex)!;
        const user = users.find(user => user.userId === userId);
        if (!user) {
            return `Error: User with ID ${userId} does not exist.`;
        }
        user.username = username;
        user.userpassword = hashPassword(userpassword);
        await writeUsersFile(filePath, users);
        return 'User updated successfully.';
    } else if (command === Command.Quit) {
        return Command.Quit;
    } else if (command.startsWith(Command.Add)) {
        return 'Error: Incomplete Adding command. Usage: Adding <userId> <username> <userpassword>';
    } else if (command.startsWith(Command.Delete)) {
        return 'Error: Incomplete Deleting command. Usage: Deleting <userId>';
    } else if (command.startsWith(Command.Update)) {
        return 'Error: Incomplete Updating command. Usage: Updating <userId> <username> <userpassword>';
    } else {
        return 'Unknown command.';
    }
}


// Main program function
async function main(): Promise<void> {
    const filePath = 'users.json';
    const users = await readUsersFile(filePath);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('Welcome to the User Management System. Enter commands:');
    let command: string;

    do {
        command = await new Promise(resolve => rl.question('> ', resolve));
        const result = await processCommand(command, users, filePath);
        if (result === Command.Quit) {
            console.log('Exiting program.');
            break;
        }
        console.log(result);
    } while (true);

    rl.close();
}

// Function to hash a password
export function hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex'); // Using SHA-256 for hashing
}

// Function to validate a password against a hash
export function validatePassword(inputPassword: string, storedHash: string): boolean {
    return hashPassword(inputPassword) === storedHash;
}

// Start the program
main().catch(err => {
    console.error('An error occurred:', err);
});
