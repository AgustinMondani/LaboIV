import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { map } from "rxjs";
import { UsuariosService } from "../../app/service/usuarios.service";

export function usuarioExisteAsyncValidator(service: UsuariosService): AsyncValidatorFn  {
    return (control: AbstractControl) => {
      const usuario = control.value;
      return service.TraerUsuarios(usuario).pipe(
        map(usuarios => {
          if (usuarios.length > 0) {
            return { usuarioExiste: 'El usuario ya existe' };
          } 
          return null;
        })
      );
    };
  }