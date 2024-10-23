import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';
import { IsEmail } from 'class-validator';
import * as argon2 from 'argon2';

@Entity('Recruiter')
export class User {
    @ObjectIdColumn()
    id!: ObjectId;  // Añadimos el operador ! para indicar que será inicializada

    @Column()
    @IsEmail()
    email!: string;  // Añadimos el operador ! para indicar que será inicializada

    @Column()
    username!: string;  // Añadimos el operador ! para indicar que será inicializada

    @Column()
    password!: string;  // Añadimos el operador ! para indicar que será inicializada

    @Column()
    roles: string[] = [];  // Inicializamos el array de roles por defecto vacío

    @Column({ default: false })  // Campo 'busy' con valor por defecto false
    busy?: boolean;

    // Método para encriptar la contraseña con Argon2
    async hashPassword() {
        this.password = await argon2.hash(this.password);
    }

    // Método para verificar la contraseña
    async validatePassword(unencryptedPassword: string) {
        return await argon2.verify(this.password, unencryptedPassword);
    }
}