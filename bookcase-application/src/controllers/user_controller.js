import { auth, db } from '@/config/firebase_config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, addDoc, getDoc, query, where, doc, updateDoc, arrayUnion } from "firebase/firestore"; // Added arrayUnion import
import { return_message } from '@/utils/io'
import { sendPasswordResetEmail } from "firebase/auth";

const userTypes = [
    "user",
    "profesional",
    "bookstore",
    "admin"
]

// -- Funciones auxiliares -- //
function check_email(email) { 
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) 
}

function check_password(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&\-_#]{8,}$/.test(password);
}

// -- Controladores -- //
async function register(email, password, nickname) {
    if (!check_email(email)) { return return_message("ERROR", "Formato de email incorrecto") }
    if (!check_password(password)) { return return_message("ERROR", "Formato de contraseña incorrecto") }

    try {
        const user_firebase = await createUserWithEmailAndPassword(auth, email, password)
    }
    catch(error) {
        return return_message("ERROR", error.message)
    }

    try {
        const user = await addDoc(collection(db, 'users'), {
            email: email,
            name: '',
            nickname: nickname,
            alta: new Date(),
            type: 'user',
            ventas: 0,
            compras: 0,
            profile_photo: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
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
            wants: [],
            saldo: 0.0,

        })

        if(!user) return return_message("ERROR", "Error al guardar usuario en base de datos")
    }
    catch(error) {
        return return_message("ERROR", error.message)
    }

    return return_message("SUCCESS", "Usuario registrado correctamente")
}

async function login(email, password) {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password)
    }
    catch(error) {
        return return_message("ERROR", error.message)
    }

    try {
        const user_query = query(collection(db, 'users'), where('email', '==', email))
        const user_data = await getDocs(user_query)
        var user

        if(user_data.empty) return return_message("ERROR", "Usuario no encontrado")
        else {
            user = user_data.docs[0].data()
            user.id = user_data.docs[0].id
        }
    }
    catch(error) {
        return return_message("ERROR", error.message)
    }

    return return_message("SUCCESS", "Usuario logueado correctamente", user)
}

async function logout() {
    try { 
        await signOut(auth)
        return return_message("SUCCESS", "Usuario deslogueado correctamente")
    }
    catch(error) { return return_message("ERROR", error.message) }
}

async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { result: "SUCCESS", message: "Correo de recuperación enviado" };
    } catch (error) {
        return { result: "ERROR", message: error.message };
    }
}

async function editUser(user) {
    try {
        await updateDoc(doc(db, 'users', user.id), {
            name: user.name,
            nickname: user.nickname,
            type: user.type,
            profile_photo: user.profile_photo,
            descripcion: user.descripcion,
            telefono: user.telefono,
            direccion: user.direccion,
            saldo: user.saldo
        })
        return return_message("SUCCESS", "Usuario actualizado correctamente")
    }
    catch(error) {
        return return_message("ERROR", error.message)
    }
}

async function editUserType(userId, userType) {
    if (!userTypes.includes(userType)) { return return_message("ERROR", "Tipo de usuario no válido") }

    try {
        await updateDoc(doc(db, 'users', userId), {
            type: userType
        })
        return return_message("SUCCESS", "Tipo de usuario actualizado correctamente")
    }
    catch(error) {
        return return_message("ERROR", error.message)
    }
}

async function get_users() {
    try {
        const users_query = query(collection(db, 'users'))
        const users_data = await getDocs(users_query)

        if(users_data.empty) return return_message("ERROR", "No hay usuarios en la base de datos")
        else {
            var users = []
            users_data.forEach(doc => { users.push({id: doc.id, data: doc.data()}) })

            return return_message("SUCCESS", "Usuarios obtenidos correctamente", users)
        }
    }
    catch (error) { return return_message("ERROR", error.message) }
}

async function getUserById(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return return_message("ERROR", "Usuario no encontrado");
        } else {
            return return_message("SUCCESS", "Usuario obtenido correctamente", { id: userSnap.id, data: userSnap.data() });
        }
    } catch (error) {
        return return_message("ERROR", error.message);
    }
}

async function get_wants_list(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return return_message("ERROR", "Usuario no encontrado");
        }

        const userData = userSnap.data();
        const wantsList = userData.wants || [];

        return return_message("SUCCESS", "Lista de deseos obtenida correctamente", wantsList);
    } catch (error) {
        return return_message("ERROR", error.message);
    }
}

async function add_want(userId, bookId) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            wants: arrayUnion(bookId)
        });

        return return_message("SUCCESS", "Libro añadido a la lista de deseos correctamente");
    } catch (error) {
        return return_message("ERROR", error.message);
    }
}

async function rmv_want(userId, bookId) {
    try {
        const userRef = doc(db, 'users', userId);
        const userData = await getDoc(userRef);
        if (!userData.exists()) { return return_message("ERROR", "Usuario no encontrado"); }

        let userWants = userData.data().wants || [];
        if (!userWants.includes(bookId)) { return return_message("ERROR", "El libro no está en la lista de deseos"); }

        userWants = userWants.filter(id => id !== bookId);
        await updateDoc(userRef, {
            wants: userWants
        });

        return return_message("SUCCESS", "Libro eliminado de la lista de deseos correctamente");
    } catch (error) {
        return return_message("ERROR", error.message);
    }
}

async function SumarVenta(userID) {
    try {
        console.log(userID)

        // Obtenemos el documento del usuario y sus datos
        const userRef = doc(db, 'users', userID);
        const userSnap = await getDoc(userRef);
        if(!userSnap.exists()) { return return_message("ERROR", "Usuario no encontrado") }
        const userData = userSnap.data()
        const ventas = userData.ventas || 0
        const new_ventas = ventas + 1

        // Actualizamos el documento del usuario con el nuevo número de ventas
        await updateDoc(userRef, {
            ventas: new_ventas
        })
        return return_message("SUCCESS", "Número de ventas actualizado correctamente")
    }
    catch(error) {
        return return_message("ERROR", error.message)
    }
}

async function SumarCompra(userID) {
    try {
        console.log(userID)

        // Obtenemos el documento del usuario y sus datos
        const userRef = doc(db, 'users', userID);
        const userSnap = await getDoc(userRef);
        if(!userSnap.exists()) { return return_message("ERROR", "Usuario no encontrado") }
        const userData = userSnap.data()
        const compras = userData.compras || 0
        const new_compras = compras + 1

        // Actualizamos el documento del usuario con el nuevo número de compras
        await updateDoc(userRef, {
            compras: new_compras
        })
        return return_message("SUCCESS", "Número de compras actualizado correctamente")
    }
    catch(error) {
        return return_message("ERROR", error.message)
    }
}

// -- Exportaciones -- //
export {
    register,
    login,
    logout,
    resetPassword,
    editUser,
    get_users,
    getUserById,
    get_wants_list,
    add_want,
    rmv_want,
    SumarVenta,
    SumarCompra,
    editUserType
}