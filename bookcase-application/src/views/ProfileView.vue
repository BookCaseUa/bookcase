<template>
  <v-container class="py-2 mt-4">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card class="pa-6" elevation="10">
          <!-- Avatar y cabecera -->
          <v-row>
            <v-col cols="12" class="text-center">
              <div style="position: relative; display: inline-block">
                <v-avatar size="120" class="mx-auto mb-4">
                  <v-img :src="profile_photo" />
                </v-avatar>
                <!-- Botón de cambiar avatar -->
                <v-btn
                  icon
                  small
                  color="#2c3e50"
                  style="position: absolute; bottom: 8px; right: 8px"
                  @click="showAvatarDialog = true"
                >
                  <font-awesome-icon icon="camera" style="color: white" />
                </v-btn>

                <!-- Modal para elegir avatar -->
                <v-dialog v-model="showAvatarDialog" max-width="600">
                  <v-card>
                    <v-card-title
                      class="text-h5"
                      style="background-color: #2c3e50; color: white"
                    >
                      {{ $t("perfil.seleccionarAvatar") }}
                    </v-card-title>

                    <!-- Tabs de Categorías -->
                    <v-tabs
                      v-model="selectedCategory"
                      bg-color="#2c3e50"
                      dark
                      show-arrows
                      class="mt-2"
                    >
                      <v-tab
                        v-for="(category, index) in avatarCategories"
                        :key="index"
                        :value="index"
                        style="text-transform: none; font-weight: bold"
                      >
                        {{ category.name }}
                      </v-tab>
                    </v-tabs>

                    <v-divider />

                    <!-- Avatares según la categoría -->
                    <v-card-text>
                      <v-row dense class="justify-center">
                        <v-col
                          v-for="(avatar, i) in avatarCategories[
                            selectedCategory
                          ].avatars"
                          :key="i"
                          cols="4"
                          md="3"
                          class="d-flex justify-center"
                        >
                          <v-avatar
                            size="80"
                            class="hover-avatar"
                            @click="selectAvatar(avatar)"
                          >
                            <v-img :src="avatar" />
                          </v-avatar>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        text
                        color="error"
                        @click="showAvatarDialog = false"
                        >{{ $t("perfil.cancelar") }}</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <input
                  type="file"
                  hidden
                  ref="fileInput"
                  @change="onFileChange"
                />
              </div>
              <h2 class="mt-4">{{ nickname }}</h2>
              <h4>{{ email }}</h4>
            </v-col>
          </v-row>

          <v-divider class="my-6" />

          <!-- Tabs -->
          <v-tabs v-model="tab" bg-color="#2c3e50" dark>
            <v-tab value="personal"
              ><font-awesome-icon icon="user" class="mr-2" />
              {{ $t("perfil.tabs.informacion") }}
            </v-tab>
            <v-tab value="contact"
              ><font-awesome-icon icon="phone" class="mr-2" />
              {{ $t("perfil.tabs.contacto") }}
            </v-tab>
            <v-tab value="address"
              ><font-awesome-icon icon="map-marker-alt" class="mr-2" />
              {{ $t("perfil.tabs.direccion") }}
            </v-tab>
            <v-tab value="security"
              ><font-awesome-icon icon="shield-alt" class="mr-2" />
              {{ $t("perfil.tabs.seguridad") }}
            </v-tab>
            <v-tab value="summary"
              ><font-awesome-icon icon="clipboard" class="mr-2" />
              {{ $t("perfil.tabs.resumen") }}
            </v-tab>
          </v-tabs>

          <!-- Contenido de pestañas -->
          <v-window v-model="tab" class="mt-4">
            <!-- Información Personal -->
            <v-window-item value="personal">
              <v-text-field
                v-model="name"
                :label="$t('perfil.informacion.nombreCompleto')"
                variant="underlined"
                :error="nameError"
                :rules="[(v) => !!v || 'Este campo es obligatorio']"
              />
              <v-text-field
                v-model="nickname"
                :label="$t('perfil.informacion.nombreUsuario')"
                variant="underlined"
              />
              <v-textarea
                v-model="descripcion"
                :label="$t('perfil.informacion.descripcion')"
                variant="underlined"
                counter
                :maxlength="descripcionLimit"
                auto-grow
              />
              <v-btn color="#2c3e50" class="mt-3" @click="updateUser">
                {{ $t("perfil.guardar") }}
              </v-btn>
            </v-window-item>

            <!-- Contacto -->
            <v-window-item value="contact">
              <v-text-field
                v-model="telefono"
                :label="$t('perfil.contacto.telefono')"
                variant="underlined"
                :error="telefonoError"
                :rules="[
                  (v) => /^\d{9}$/.test(v) || 'Debe ser un teléfono válido',
                ]"
              />
              <v-btn color="#2c3e50" class="mt-3" @click="updateUser">
                {{ $t("perfil.guardar") }}
              </v-btn>
            </v-window-item>

            <!-- Dirección -->
            <v-window-item value="address">
              <v-text-field
                v-model="direccion.pais"
                :label="$t('perfil.direccion.pais')"
                variant="underlined"
              />
              <v-text-field
                v-model="direccion.provincia"
                :label="$t('perfil.direccion.provincia')"
                variant="underlined"
              />
              <v-text-field
                v-model="direccion.localidad"
                :label="$t('perfil.direccion.ciudad')"
                variant="underlined"
              />
              <v-text-field
                v-model="direccion.codigo_postal"
                :label="$t('perfil.direccion.codigoPostal')"
                variant="underlined"
              />
              <v-text-field
                v-model="direccion.calle"
                :label="$t('perfil.direccion.calle')"
                variant="underlined"
              />
              <v-text-field
                v-model="direccion.numero"
                :label="$t('perfil.direccion.numero')"
                variant="underlined"
              />
              <v-text-field
                v-model="direccion.piso"
                :label="$t('perfil.direccion.piso')"
                variant="underlined"
              />
              <v-btn color="#2c3e50" class="mt-3" @click="updateUser">
                {{ $t("perfil.guardar") }}
              </v-btn>
            </v-window-item>

            <!-- Seguridad -->
            <v-window-item value="security">
              <v-text-field
                v-model="currentPassword"
                :label="$t('perfil.seguridad.actual')"
                :type="showCurrentPassword ? 'text' : 'password'"
                variant="underlined"
              >
                <template #append-inner>
                  <font-awesome-icon
                    :icon="showCurrentPassword ? 'eye-slash' : 'eye'"
                    style="cursor: pointer; color: #2c3e50"
                    @click="showCurrentPassword = !showCurrentPassword"
                  />
                </template>
              </v-text-field>

              <v-text-field
                v-model="newPassword"
                :label="$t('perfil.seguridad.nueva')"
                :type="showNewPassword ? 'text' : 'password'"
                variant="underlined"
              >
                <template #append-inner>
                  <font-awesome-icon
                    :icon="showNewPassword ? 'eye-slash' : 'eye'"
                    style="cursor: pointer; color: #2c3e50"
                    @click="showNewPassword = !showNewPassword"
                  />
                </template>
              </v-text-field>

              <v-text-field
                v-model="confirmPassword"
                :label="$t('perfil.seguridad.confirmar')"
                :type="showConfirmPassword ? 'text' : 'password'"
                variant="underlined"
              >
                <template #append-inner>
                  <font-awesome-icon
                    :icon="showConfirmPassword ? 'eye-slash' : 'eye'"
                    style="cursor: pointer; color: #2c3e50"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </v-text-field>

              <v-btn color="#2c3e50" class="mt-3" @click="changePassword">
                {{ $t("perfil.seguridad.cambiar") }}
              </v-btn>

              <v-divider class="my-6" />

              <div class="text-center">
                <v-btn color="#e74c3c" @click="logout">
                  {{ $t("perfil.seguridad.cerrarSesion") }}
                </v-btn>
              </div>
            </v-window-item>

            <!-- Resumen -->
            <v-window-item value="summary">
              <v-card class="mb-6" color="#fafafa" dark>
                <v-card-title>{{ $t("perfil.resumen.titulo") }}</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6"
                      ><strong>{{ $t("perfil.resumen.correo") }}:</strong>
                      {{ email }}</v-col
                    >
                    <v-col cols="12" sm="6"
                      ><strong>{{ $t("perfil.resumen.tipo") }}:</strong>
                      {{ type }}</v-col
                    >
                    <v-col cols="12" sm="6"
                      ><strong>{{ $t("perfil.resumen.saldo") }}:</strong>
                      {{ saldo }} €</v-col
                    >
                    <v-col cols="12" sm="6"
                      ><strong>{{ $t("perfil.resumen.ventas") }}:</strong>
                      {{ ventas?.length || 0 }}</v-col
                    >
                    <v-col cols="12" sm="6"
                      ><strong>{{ $t("perfil.resumen.compras") }}:</strong>
                      {{ compras?.length || 0 }}</v-col
                    >
                  </v-row>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>

    <!-- Dialog de cierre de sesión -->
    <v-dialog v-model="logoutDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">¿Cerrar sesión?</v-card-title>
        <v-card-text>¿Estás seguro de que quieres cerrar sesión?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#2c3e50" @click="logoutDialog = false">Cancelar</v-btn>
          <v-btn color="#e74c3c" @click="confirmLogout">Cerrar sesión</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user_store";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const userStore = useUserStore();
const router = useRouter();
const storage = getStorage();

// Store refs
const {
  name,
  email,
  nickname,
  profile_photo,
  descripcion,
  telefono,
  direccion,
  saldo,
  ventas,
  compras,
  type,
} = storeToRefs(userStore);

// UI control
const tab = ref("personal");
const snackbar = ref({ show: false, text: "", color: "success" });
const logoutDialog = ref(false);

// Contraseñas
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Validaciones
const nameError = ref(false);
const telefonoError = ref(false);
const descripcionLimit = 300;

// Mostrar notificación
function showMessage(text, color = "success") {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
}

// Validar antes de guardar
function validarCampos() {
  nameError.value = false; // Ya no es obligatorio nombre
  telefonoError.value = telefono.value && !/^\d{9}$/.test(telefono.value);
  return !(nameError.value || telefonoError.value);
}

// Guardar cambios
async function updateUser() {
  if (!validarCampos()) {
    showMessage("Por favor, corrige los campos marcados.", "error");
    return;
  }

  try {
    await userStore.editUserInDatabase();

    userStore.setCredentials({
      id: userStore.id,
      email: userStore.email,
      name: name.value,
      nickname: nickname.value,
      profile_photo: profile_photo.value,
      descripcion: descripcion.value,
      telefono: telefono.value,
      direccion: direccion.value,
      saldo: saldo.value,
      compras: compras.value,
      ventas: ventas.value,
      alta: userStore.alta,
      type: type.value,
    });

    showMessage("Cambios guardados correctamente");
  } catch (error) {
    console.error(error);
    showMessage("Error al guardar los cambios", "error");
  }
}

// Logout con confirmación
function logout() {
  logoutDialog.value = true;
}

// Confirmar cierre de sesión
function confirmLogout() {
  userStore.logout();
  router.push("/");
  logoutDialog.value = false;
  showMessage("Sesión cerrada");
}

// Subida de imagen
async function onFileChange(event) {
  const file = event.target.files[0];
  if (file && userStore.id) {
    const storagePath = `profile_photos/${userStore.id}/${file.name}`;
    const fileRef = storageRef(storage, storagePath);

    try {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      profile_photo.value = downloadURL;
      await updateUser();
      showMessage("Foto de perfil actualizada");
    } catch (error) {
      console.error(error);
      showMessage("Error al subir la imagen", "error");
    }
  }
}

// Cambiar contraseña
async function changePassword() {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    return showMessage("Rellena todos los campos de contraseña", "error");
  }

  if (newPassword.value !== confirmPassword.value) {
    return showMessage("Las nuevas contraseñas no coinciden", "error");
  }

  // Nueva validación de contraseña robusta
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword.value)) {
    return showMessage(
      "La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.",
      "error"
    );
  }

  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword.value
    );

    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword.value);

    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";

    showMessage("Contraseña actualizada correctamente");
  } catch (error) {
    console.error(error);
    showMessage("Error al cambiar la contraseña: " + error.message, "error");
  }
}

// Para controlar el modal
const showAvatarDialog = ref(false);
const selectedCategory = ref(0);

// Categorías de Avatares
const avatarCategories = [
  {
    name: "Emojis",
    avatars: [
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Brian",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Vivian",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Avery",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Oliver",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Chase",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Kimberly",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Luis",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Christian",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Jameson",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Katherine",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Leo",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Sadie",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Amaya",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Mason",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Wyatt",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Jocelyn",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Mackenzie",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Alexander",
      "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Liliana",
    ],
  },
  {
    name: "Robots",
    avatars: [
      "https://api.dicebear.com/9.x/bottts/svg?seed=Destiny",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Robert",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Christopher",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Alexander",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Oliver",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Mason",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Amaya",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Sophia",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Valentina",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Wyatt",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Ryan",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Jack",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Nolan",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Liliana",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Easton",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Ryker",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Andrea",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Sadie",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Leo",
      "https://api.dicebear.com/7.x/bottts/svg?seed=Liam",
    ],
  },
  {
    name: "Fantasía",
    avatars: [
      "https://images.icon-icons.com/2622/PNG/512/brand_jedi_order_icon_158843.png",
      "https://images.icon-icons.com/1070/PNG/512/darth-vader_icon-icons.com_76959.png",
      "https://images.icon-icons.com/1070/PNG/512/clone-trooper_icon-icons.com_76948.png",
      "https://images.icon-icons.com/567/PNG/512/r2d2_icon-icons.com_54376.png",
      "https://images.icon-icons.com/2622/PNG/512/medieval_knight_icon_158282.png",
      "https://images.icon-icons.com/2622/PNG/512/medieval_spartan_icon_157502.png",
      "https://images.icon-icons.com/4059/PNG/512/fairytale_sword_fantasy_world_weapon_icon_258474.png",
      "https://images.icon-icons.com/3247/PNG/512/hat_wizard_icon_198538.png",
      "https://images.icon-icons.com/1508/PNG/512/spaceinvaders_104010.png",
      "https://images.icon-icons.com/1603/PNG/512/video-game-play-toad-mushroom-mario_108577.png",
      "https://images.icon-icons.com/749/PNG/512/pacman_icon-icons.com_63747.png",
      "https://images.icon-icons.com/159/PNG/256/minecraft_22400.png",
      "https://images.icon-icons.com/851/PNG/512/Pokeball_icon-icons.com_67533.png",
      "https://images.icon-icons.com/851/PNG/512/bulbasaur_icon-icons.com_67580.png",
      "https://images.icon-icons.com/851/PNG/512/charmander_icon-icons.com_67576.png",
      "https://images.icon-icons.com/851/PNG/512/squirtle_icon-icons.com_67504.png",
      "https://images.icon-icons.com/3688/PNG/512/death_monster_scary_devil_halloween_icon_229411.png",
      "https://images.icon-icons.com/3688/PNG/512/evil_scary_monster_frankentein_halloween_icon_229392.png",
      "https://images.icon-icons.com/3688/PNG/512/ghost_monster_dead_horror_zombie_halloween_icon_229398.png",
      "https://images.icon-icons.com/3158/PNG/512/creature_fantasy_monster_ogre_orc_icon_193280.png",
    ],
  },
  {
    name: "Animales",
    avatars: [
      "https://tse3.mm.bing.net/th/id/OIP.mG3GNQ_kbtN5tMLsCQDFTgHaH6?pid=Api", // Perro
      "https://tse1.mm.bing.net/th?id=OIP.696iNeIW7ovi0_WDZxAadwHaGO&pid=Api", // Gato
      "https://tse4.mm.bing.net/th?id=OIP.h3d5hPOcCaRvy7EDeK09kwHaIc&pid=Api", // Vaca
      "https://tse4.mm.bing.net/th/id/OIP.zJznsgQ5GEgBHBmJPbBbGAHaFF?pid=Api", // Oso
      "https://tse2.mm.bing.net/th/id/OIP.bQM2Q5ECFpC4RGywKO11cgHaHn?pid=Api", // Conejo
      "https://tse2.mm.bing.net/th?id=OIP.KMzFny4XknIoNsS-n5hvFwHaHa&pid=Api", // Pingüino
      "https://tse4.mm.bing.net/th?id=OIP.X3ZGiJo560n67Y209PiA6wHaHa&pid=Api", // León
      "https://tse3.mm.bing.net/th/id/OIP.2dov8lU7w4fVUwhuodE6aAHaI3?pid=Api", // Jirafa
      "https://tse1.mm.bing.net/th?id=OIP.gTOF9aY_Bdhz1qhoYya-jQHaFU&pid=Api", // Elefante
      "https://tse4.mm.bing.net/th?id=OIP.jonh3EwUgDK1U5WsyFNSpwHaHa&pid=Api", // Zorro
      "https://tse4.mm.bing.net/th?id=OIP.kDyE99pyvV_jJXflBkU9tgHaJs&pid=Api", // Tigre
      "https://tse2.mm.bing.net/th?id=OIP.kT8my5ZqNzHak4Sf62O2MgHaHa&pid=Api", // Panda
      "https://tse2.mm.bing.net/th?id=OIP.WMRwpGoCXUJdJHywNJpJAwHaHa&pid=Api", // Koala
      "https://tse1.mm.bing.net/th?id=OIP.f7pk9rYxqh1SdgB3TI_2cwHaIS&pid=Api", // Mono
      "https://tse3.mm.bing.net/th/id/OIP.72o2sK1gO0EM--my5t-KmwHaHa?pid=Api", // Pato
      "https://tse4.mm.bing.net/th?id=OIP.ASQ4mvJJPax6Y0WzITkVawHaHa&pid=Api", // Rana
      "https://tse4.mm.bing.net/th?id=OIP.QCB53cTmrmBlSValdrCcXAHaHT&pid=Api", // Caballo
      "https://tse1.mm.bing.net/th/id/OIP.Wx2boM3N5GlgBe0-aLzZAwHaHa?pid=Api", // Cerdo
      "https://tse3.mm.bing.net/th/id/OIP.LiUWfpnEtPmI-fyuWdmeMgHaHa?pid=Api", // Cebra
      "https://tse4.mm.bing.net/th/id/OIP.ZVQqMhDrB--19syAd6VdXwHaHa?pid=Api", // Oveja
    ],
  },
  {
    name: "Pixel Art",
    avatars: [
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Brian",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Vivian",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Avery",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Oliver",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Chase",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Kimberly",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Luis",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Emery",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Christian",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Jameson",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Katherine",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Leo",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Sadie",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Amaya",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Mason",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Wyatt",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Jocelyn",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Mackenzie",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Alexander",
      "https://api.dicebear.com/9.x/pixel-art/svg?seed=Liliana",
    ],
  },
  {
    name: "Iconos",
    avatars: [
      "https://api.dicebear.com/9.x/icons/svg?seed=Brian",
      "https://api.dicebear.com/9.x/icons/svg?seed=Vivian",
      "https://api.dicebear.com/9.x/icons/svg?seed=Avery",
      "https://api.dicebear.com/9.x/icons/svg?seed=Oliver",
      "https://api.dicebear.com/9.x/icons/svg?seed=Chase",
      "https://api.dicebear.com/9.x/icons/svg?seed=Kimberly",
      "https://api.dicebear.com/9.x/icons/svg?seed=Luis",
      "https://api.dicebear.com/9.x/icons/svg?seed=Emery",
      "https://api.dicebear.com/9.x/icons/svg?seed=Christian",
      "https://api.dicebear.com/9.x/icons/svg?seed=Jameson",
      "https://api.dicebear.com/9.x/icons/svg?seed=Katherine",
      "https://api.dicebear.com/9.x/icons/svg?seed=Leo",
      "https://api.dicebear.com/9.x/icons/svg?seed=Sadie",
      "https://api.dicebear.com/9.x/icons/svg?seed=Amaya",
      "https://api.dicebear.com/9.x/icons/svg?seed=Mason",
      "https://api.dicebear.com/9.x/icons/svg?seed=Wyatt",
      "https://api.dicebear.com/9.x/icons/svg?seed=Jocelyn",
      "https://api.dicebear.com/9.x/icons/svg?seed=Mackenzie",
      "https://api.dicebear.com/9.x/icons/svg?seed=Alexander",
      "https://api.dicebear.com/9.x/icons/svg?seed=Liliana",
    ],
  },
];

// Función para seleccionar avatar
function selectAvatar(avatarUrl) {
  profile_photo.value = avatarUrl;
  showAvatarDialog.value = false;
}
</script>

<style scoped>
/* Fondo global */
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: var(--color-background);
  color: var(--color-text);
  display: flex;
  flex-direction: column;
}

/* Forzar fondo claro personalizado solo en modo claro */
:root[data-theme="light"] .profile-container {
  background-color: #fafafa !important;
}

:root[data-theme="light"] .profile-card {
  background-color: #f5f5f5 !important;
  color: #000 !important;
  border: 1px solid #e0e0e0;
}

/* Página de perfil */
#profile-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Contenedor principal */
.profile-container {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: var(--color-background);
  box-shadow: none !important;
}

/* Tarjeta de perfil */
.profile-card,
.v-card {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Títulos */
h2,
h4 {
  margin: 0;
  color: var(--color-heading);
}

/* Botones */
.v-btn {
  border-radius: 30px !important;
  text-transform: none !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding-left: 20px;
  padding-right: 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Tabs */
.v-tabs,
.v-tab,
.v-tab--active {
  background-color: #2c3e50 !important;
  color: white !important;
  border-radius: 8px 8px 0 0 !important;
}

/* Contenido interno */
.v-card-title,
.v-card-text,
.v-card-actions {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}

/* Título del modal de avatar */
.v-dialog .v-card-title {
  background-color: #2c3e50 !important;
  color: white !important;
}

/* Modal completo */
.v-dialog .v-card {
  background-color: var(--color-background);
  color: var(--color-text);
}

/* Botón de cerrar rojo */
.v-btn.text.color-error {
  color: #e74c3c !important;
}

/* Avatares con efecto hover */
.hover-avatar {
  cursor: pointer;
  transition: 0.3s;
}

.hover-avatar:hover {
  transform: scale(1.1);
}
</style>
