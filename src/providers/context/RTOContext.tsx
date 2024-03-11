"use client"
import { createContext } from 'react';
import { RTOContextInteface } from '@_types/RTO/interface';

export const RTOContext = createContext<RTOContextInteface>({} as RTOContextInteface);
