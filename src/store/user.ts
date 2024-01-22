import { create } from "zustand";
import { IRol } from "../types/types";

interface IUserData {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  imagenURL: string;
  nombreUsuario: string;
  roles: IRol[];
}

type Actions = {
  setNombre: (nombre: string) => void;
  setApellidoPaterno: (apellidoPaterno: string) => void;
  setApellidoMaterno: (apellidoMaterno: string) => void;
  setTelefono: (telefono: string) => void;
  setEmail: (email: string) => void;
  setImagenURL: (imagenURL: string) => void;
  setNombreUsuario: (nombreUsuario: string) => void;
  setRoles: (roles: IRol[]) => void;
  setId: (id: string) => void;
};

export const useUserInfoStore = create<IUserData & Actions>((set) => {
  return {
    id: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    telefono: "",
    email: "",
    imagenURL: "",
    nombreUsuario: "",
    roles: [],
    setId: (state: string) => set(() => ({ id: state })),
    setNombre: (state: string) => set(() => ({ nombre: state })),
    setApellidoPaterno: (state: string) =>
      set(() => ({ apellidoPaterno: state })),
    setApellidoMaterno: (state: string) =>
      set(() => ({ apellidoMaterno: state })),
    setTelefono: (state: string) => set(() => ({ telefono: state })),
    setEmail: (state: string) => set(() => ({ email: state })),
    setImagenURL: (state: string) => set(() => ({ imagenURL: state })),
    setNombreUsuario: (state: string) => set(() => ({ nombreUsuario: state })),
    setRoles: (state: IRol[]) => set(() => ({ roles: state })),
  };
});
