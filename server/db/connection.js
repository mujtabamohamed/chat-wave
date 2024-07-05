import mongoose from 'mongoose';

const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ni0ufgl.mongodb.net/`;

mongoose.connect(url).then(() => console.log("Connected to DB")).catch((e) => console.log('Error', e));    