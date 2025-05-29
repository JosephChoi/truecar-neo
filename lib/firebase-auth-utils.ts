import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth'
import { auth } from './firebase'
import { AdminUserService } from './firestore-utils'
import { FirebaseUser } from './firestore.types'

export class FirebaseAuthService {
  // 이메일/비밀번호로 로그인
  static async signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      }
    } catch (error: any) {
      console.error('로그인 오류:', error)
      
      // Firebase 에러 코드에 따른 한국어 메시지
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('등록되지 않은 이메일입니다.')
        case 'auth/wrong-password':
          throw new Error('비밀번호가 올바르지 않습니다.')
        case 'auth/invalid-email':
          throw new Error('유효하지 않은 이메일 형식입니다.')
        case 'auth/user-disabled':
          throw new Error('비활성화된 계정입니다.')
        case 'auth/too-many-requests':
          throw new Error('너무 많은 로그인 시도입니다. 잠시 후 다시 시도해주세요.')
        default:
          throw new Error('로그인에 실패했습니다.')
      }
    }
  }

  // 이메일/비밀번호로 회원가입
  static async signUpWithEmail(email: string, password: string, displayName?: string): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // 표시 이름 설정
      if (displayName) {
        await updateProfile(user, { displayName })
      }
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || displayName || null,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      }
    } catch (error: any) {
      console.error('회원가입 오류:', error)
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('이미 사용 중인 이메일입니다.')
        case 'auth/invalid-email':
          throw new Error('유효하지 않은 이메일 형식입니다.')
        case 'auth/weak-password':
          throw new Error('비밀번호는 최소 6자리 이상이어야 합니다.')
        default:
          throw new Error('회원가입에 실패했습니다.')
      }
    }
  }

  // 로그아웃
  static async signOut(): Promise<void> {
    try {
      await signOut(auth)
      console.log('로그아웃 성공')
    } catch (error) {
      console.error('로그아웃 오류:', error)
      throw new Error('로그아웃에 실패했습니다.')
    }
  }

  // 현재 사용자 정보 가져오기
  static getCurrentUser(): FirebaseUser | null {
    const user = auth.currentUser
    if (!user) return null
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
  }

  // 인증 상태 변화 감지
  static onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        })
      } else {
        callback(null)
      }
    })
  }

  // 비밀번호 재설정 이메일 발송
  static async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
      console.log('비밀번호 재설정 이메일 발송 성공')
    } catch (error: any) {
      console.error('비밀번호 재설정 오류:', error)
      
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('등록되지 않은 이메일입니다.')
        case 'auth/invalid-email':
          throw new Error('유효하지 않은 이메일 형식입니다.')
        default:
          throw new Error('비밀번호 재설정 이메일 발송에 실패했습니다.')
      }
    }
  }

  // 프로필 업데이트
  static async updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      await updateProfile(user, updates)
      console.log('프로필 업데이트 성공')
    } catch (error) {
      console.error('프로필 업데이트 오류:', error)
      throw new Error('프로필 업데이트에 실패했습니다.')
    }
  }

  // 비밀번호 변경
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser
      if (!user || !user.email) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // 현재 비밀번호로 재인증
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      
      // 새 비밀번호로 변경
      await updatePassword(user, newPassword)
      console.log('비밀번호 변경 성공')
    } catch (error: any) {
      console.error('비밀번호 변경 오류:', error)
      
      switch (error.code) {
        case 'auth/wrong-password':
          throw new Error('현재 비밀번호가 올바르지 않습니다.')
        case 'auth/weak-password':
          throw new Error('새 비밀번호는 최소 6자리 이상이어야 합니다.')
        default:
          throw new Error('비밀번호 변경에 실패했습니다.')
      }
    }
  }

  // 관리자 권한 확인
  static async checkAdminPermission(email?: string): Promise<boolean> {
    try {
      const userEmail = email || auth.currentUser?.email
      if (!userEmail) return false
      
      return await AdminUserService.isAdmin(userEmail)
    } catch (error) {
      console.error('관리자 권한 확인 오류:', error)
      return false
    }
  }

  // 관리자 로그인 (일반 로그인 + 권한 확인)
  static async signInAsAdmin(email: string, password: string): Promise<FirebaseUser> {
    try {
      // 일반 로그인 수행
      const user = await this.signInWithEmail(email, password)
      
      // 관리자 권한 확인
      const isAdmin = await this.checkAdminPermission(email)
      if (!isAdmin) {
        // 관리자가 아니면 로그아웃
        await this.signOut()
        throw new Error('관리자 권한이 없습니다.')
      }
      
      console.log('관리자 로그인 성공')
      return user
    } catch (error) {
      console.error('관리자 로그인 오류:', error)
      throw error
    }
  }

  // 이메일 인증 상태 확인
  static isEmailVerified(): boolean {
    const user = auth.currentUser
    return user?.emailVerified || false
  }

  // 로그인 상태 확인
  static isAuthenticated(): boolean {
    return auth.currentUser !== null
  }

  // 사용자 UID 가져오기
  static getCurrentUserId(): string | null {
    return auth.currentUser?.uid || null
  }

  // 사용자 이메일 가져오기
  static getCurrentUserEmail(): string | null {
    return auth.currentUser?.email || null
  }
}

// 인증 관련 상수
export const AUTH_ERRORS = {
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  WEAK_PASSWORD: 'auth/weak-password',
  INVALID_EMAIL: 'auth/invalid-email',
  USER_DISABLED: 'auth/user-disabled',
  TOO_MANY_REQUESTS: 'auth/too-many-requests'
} as const 