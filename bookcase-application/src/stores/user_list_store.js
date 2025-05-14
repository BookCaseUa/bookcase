import { defineStore } from 'pinia'
import { get_users, editUserType } from '@/controllers/user_controller'

export const useUserListStore = defineStore('userList', {
    state: () => ({ users: [] }),

    persist: { storage: window.localStorage, },

    actions: {
        async fetchUsers() {
            try {
                this.users = []
                const result = await get_users()
                if(result.result == "SUCCESS") { this.users = result.data }
            }
            catch(error) { console.error(error) }
        },

        async getUsers() {
            try {
                if(this.users.length == 0) { await this.fetchUsers() }
                return {
                    result: "SUCCESS",
                    message: "Usuarios obtenidos correctamente",
                    data: this.users
                }
            }
            catch(error) { console.error(error) }
        },

        async getUsersFiltered(name = null, ventas = null, pais = null) {
            let users = await this.getUsers()
            if(name) { users = users.filter(user => user.name.toLowerCase().includes(name.toLowerCase())) }
            if(ventas) { users = users.filter(user => user.ventas == ventas) }
            if(pais) { users = users.filter(user => user.pais == pais) }
            return users
        },

        async editUserType(userId, userType) {
            try {
                const result = await editUserType(userId, userType)
                if(result.result == "SUCCESS") { this.fetchUsers() }
                return result
            }
            catch(error) { return { result: "ERROR", message: error.message } }
        }
    }
});