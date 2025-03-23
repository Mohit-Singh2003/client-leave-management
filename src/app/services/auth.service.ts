import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { auth, db } from '../firebase.config'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  async register(email: string, password: string, role: UserRole): Promise<boolean> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), { email, role });
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      return false;
    }
  }

  async getFirebaseToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken(true);
    } else {
      console.error("No user is logged in");
      return null;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

      if (userDoc.exists()) {
        const { role } = userDoc.data() as { role: UserRole };

        if (!Object.values(UserRole).includes(role)) {
          console.error('Unknown role found in database:', role);
          return false;
        }

        const user: User = {
          username: email.split('@')[0],
          role,
          id: userCredential.user.uid,
          password
        };

        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user)); 
        return true;
      } else {
        console.error('User role data not found');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  async logout(): Promise<void> {
    await signOut(auth);
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }
}
