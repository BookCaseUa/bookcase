import { defineStore } from 'pinia'
import { register, login, logout, resetPassword, editUser, getUserById } from '@/controllers/user_controller'
import { useCartStore } from './cart_store';

export const useUserStore = defineStore('user', {
    state: () => ({
        logged: false,
        id: '',
        email: '',
        name: '',
        nickname: '',
        alta: null,
        type: '',
        ventas: 0,
        compras: 0,
        profile_photo: '',
        descripcion: '',
        telefono: '',
        direccion: {
            calle: '',
            numero: '',
            piso: '',
            codigo_postal: '',
            localidad: '',
            provincia: '',
            pais: ''
        },
        saldo: 0.0,
    }),

    persist: { storage: window.localStorage, },

    actions: {
        setCredentials(user) {
            this.id = user.id
            this.email = user.email
            this.name = user.name
            this.nickname = user.nickname
            this.alta = user.alta
            this.type = user.type
            this.ventas = user.ventas
            this.compras = user.compras
            this.profile_photo = user.profile_photo
            this.descripcion = user.descripcion
            this.telefono = user.telefono
            this.direccion = user.direccion
            this.saldo = user.saldo
            this.logged = true
        },

        resetCredentials() {
            this.id = ''
            this.name = ''
            this.email = ''
            this.type = ''
            this.logged = false
            this.ventas = 0
            this.compras = 0
        },

        async register(email, password, name) {
            try {
                const result = await register(email, password, name)
                if(result.result == "SUCCESS") { await this.login(email, password) }
            }
            catch(error) { console.error(error) }
        },

        async login(email, password) {
            try {
                const result = await login(email, password)
                if(result.result == "SUCCESS") {
                    this.setCredentials(result.data)
                    const cartStore = useCartStore();
                    cartStore.loadCart();
                }
            }
            catch(error) { console.error(error) }
        },

        async logout() {
            try {
                await logout()
                this.resetCredentials()
            }
            catch(error) { console.error(error) }
        },

        async recoverPassword(email) {
            try {
                return await resetPassword(email);
            }
            catch(error) {
                console.error(error)
            }
        },

        async editUserInDatabase() {
            try {
                if(this.id == '' || this.id == null || this.logged == false) return { result: "ERROR", message: "Usuario no logueado" }
                else await editUser(this)
            }
            catch(error) {
                console.error(error)
            }
        },

        async fetchUserById(userId) {
            try {
                const result = await getUserById(userId);
                if (result.result === "SUCCESS") {
                    return result.data;
                } else {
                    console.error("Error fetching user:", result.message);
                    return null;
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                return null;
            }
        }
    }
});