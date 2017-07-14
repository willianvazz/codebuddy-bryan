import { Mongo } from 'meteor/mongo';

export const Courses = new Mongo.Collection('courses');
Courses.friendlySlugs({slugFrom: ['name', 'year', 'semester']});