import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { IsUniqueConstraintInput } from './is-unique';

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { modelName }: IsUniqueConstraintInput = args.constraints[0];

    const { property } = args;

    // Check if the model is registered
    if (!this.connection.models[modelName]) {
      console.error(`Model for ${modelName} not found.`);
      throw new Error(`Model for ${modelName} not found.`);
    }

    const model = this.connection.model(modelName);
    const exists = await model.findOne({ [property]: value }).exec();

    return !exists;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    const errorMessage = `${validationArguments.value} has already been taken.`;
    return errorMessage;
  }
}
