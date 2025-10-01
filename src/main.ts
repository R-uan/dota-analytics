import { Database } from "./database/database";
import express, { Request, Response } from 'express';

const app = express();

console.log(await Database.getHeroesPickRate());
