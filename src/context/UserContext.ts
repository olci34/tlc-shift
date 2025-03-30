// import { AUTH_STATUS } from '@/lib/utils/auth';
// import { useSession } from 'next-auth/react';
// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// export type UserSnapshot = {
//   id: string;
//   userName: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   age: number;
// };

// type UserContextType = {
//   user: UserSnapshot | undefined;
//   setUser: (user: UserSnapshot) => void;
// };

// const UserContext = createContext<UserContextType | null>(null);

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<UserSnapshot>();
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     if (status !== AUTH_STATUS.Loading) {
//       setUser(session?.user as UserSnapshot);
//     }
//   }, [status, session, user]);

//   return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) throw new Error('useUser must be used within a UserProvider');
//   return context;
// };
