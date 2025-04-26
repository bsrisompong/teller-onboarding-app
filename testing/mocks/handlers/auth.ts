import { http } from 'msw';
import { authenticator } from 'otplib';
import { API_URL } from '@/config/constants';
import { db } from '../db';

// Google OAuth handlers
export const authHandlers = [];
