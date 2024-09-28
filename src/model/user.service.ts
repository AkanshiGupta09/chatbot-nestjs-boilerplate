import { Injectable } from '@nestjs/common';
import { dynamoDBClient } from 'src/config/database-config.service';
import { v4 as uuidv4 } from 'uuid';
import { UserModule } from 'src/model/user.module';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const { USERS_TABLE } = process.env;

@Injectable()
export class UserService {

  async createUser(mobileNumber: string, botID: string): Promise<any> {
    try {
      // Check if the user already exists in the database
      let user = await this.findUserByMobileNumber(mobileNumber, botID);

      if (user) {
        // If user exists, update the existing user
        await this.saveUser(user); // Save the updated user
        return user;
      } else {
        // If user doesn't exist, create a new user
        const newUser = {
          TableName: USERS_TABLE,
          Item: {
            id: uuidv4(),
            mobileNumber,
            Botid: botID,
          },
        };
        await dynamoDBClient().put(newUser).promise();
        return newUser.Item; // Return the newly created user
      }
    } catch (error) {
      console.error('Error in createUser:', error);
      throw new Error('Failed to create or update user.');
    }
  }

  /**
   * Find a user by their mobile number and bot ID.
   * @param mobileNumber The user's mobile number
   * @param botID The bot identifier for the user
   * @returns The found user or null if not found
   */
  async findUserByMobileNumber(mobileNumber: string, botID: string): Promise<any | null> {
    try {
      const params = {
        TableName: USERS_TABLE,
        KeyConditionExpression: 'mobileNumber = :mobileNumber and Botid = :botID',
        ExpressionAttributeValues: {
          ':mobileNumber': mobileNumber,
          ':botID': botID,
        },
      };
      const result = await dynamoDBClient().query(params).promise();
      return result.Items?.[0] || null; // Return the first user found or null if none exist
    } catch (error) {
      console.error('Error querying user from DynamoDB:', error);
      return null;
    }
  }

  /**
   * Save or update a user in the database with mobileNumber and botID.
   * @param user The user entity to be saved or updated
   * @returns The result of the DynamoDB save operation
   */
  async saveUser(user: any): Promise<any> {
    try {
      const updateUser = {
        TableName: USERS_TABLE,
        Item: {
          mobileNumber: user.mobileNumber,
          Botid: user.Botid,
        },
      };
      await dynamoDBClient().put(updateUser).promise();
      return updateUser.Item; // Return the saved user
    } catch (error) {
      console.error('Error saving user to DynamoDB:', error);
      throw new Error('Failed to save user.');
    }
  }

  /**
   * Delete a user from the database based on mobileNumber and botID.
   * @param mobileNumber The user's mobile number
   * @param botID The bot identifier for the user
   */
  async deleteUser(mobileNumber: string, botID: string): Promise<void> {
    try {
      const params = {
        TableName: USERS_TABLE,
        Key: {
          mobileNumber,
          Botid: botID,
        },
      };
      await dynamoDBClient().delete(params).promise();
      console.log(`User with mobileNumber ${mobileNumber} and Botid ${botID} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting user from DynamoDB:', error);
      throw new Error('Failed to delete user.');
    }
  }
}
