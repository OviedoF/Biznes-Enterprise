const basic = [{
    permission: 'Nombre en tarjeta',
    access: true 
}, {
    permission: 'Descripción',
    access: true,
    limit: 50
}, {
    permission: 'Foto de portada',
    access: false
}, {
    permission: 'Foto de empresa',
    access: false
}, {
    permission: 'Cargo',
    access: true
}, {
    permission: 'Empresa',
    access: true
}, {
    permission: 'Correo electrónico',
    access: true
}, {
    permission: 'Guardar contacto',
    access: true
}, {
    permission: 'VCard',
    access: true
}, {
    permission: 'Libre de publicidad',
    access: false
}, {
    permission: 'Cambiar URL',
    access: false
}, {
    permission: 'Tipos de perfil',
    access: ['public']
}, {
    permission: 'Redes favoritas',
    access: false,
    limit: 0
}, {
    permission: 'Redes sociales favoritas obligatorias',
    access: ['website']
}, {
    permission: 'Redes sociales favoritas excluidas',
    access: ['facebook', 'twitter', 'linkedin']
}, {
    permission: "Redes sociales adicionales",
    access: true,
    limit: 4
}, {
    permission: 'Redes sociales adicionales obligatorias',
    access: []
}, {
    permission: 'Diseño',
    access: false
}, {
    permission: 'Tarjetas',
    access: true,
    limit: 1
}, {
    permission: 'Botones adicionales',
    access: true,
    limit: 3
}]

const pro = [{
    permission: 'Nombre en tarjeta',
    access: true 
}, {
    permission: 'Descripción',
    access: true,
    limit: 140
}, {
    permission: 'Foto de portada',
    access: true
}, {
    permission: 'Foto de empresa',
    access: true
}, {
    permission: 'Cargo',
    access: true
}, {
    permission: 'Empresa',
    access: true
}, {
    permission: 'Correo electrónico',
    access: true
}, {
    permission: 'Guardar contacto',
    access: true
}, {
    permission: 'VCard',
    access: true
}, {
    permission: 'Libre de publicidad',
    access: true
}, {
    permission: 'Cambiar URL',
    access: true
}, {
    permission: 'Tipos de perfil',
    access: ['public', 'private']
}, {
    permission: 'Redes favoritas',
    access: true,
    limit: 3
}, {
    permission: 'Redes sociales favoritas obligatorias',
    access: false
}, {
    permission: 'Redes sociales favoritas excluidas',
    access: ['facebook', 'twitter', 'linkedin']
}, {
    permission: "Redes sociales adicionales",
    access: true,
    limit: 8
}, {
    permission: 'Redes sociales adicionales obligatorias',
    access: []
}, {
    permission: 'Diseño',
    access: true
}, {
    permission: 'Tarjetas',
    access: true,
    limit: 3
}, {
    permission: 'Botones adicionales',
    access: true,
    limit: 5
}]

const vip = [{
    permission: 'Nombre en tarjeta',
    access: true 
}, {
    permission: 'Descripción',
    access: true,
    limit: 150
}, {
    permission: 'Foto de portada',
    access: true
}, {
    permission: 'Foto de empresa',
    access: true
}, {
    permission: 'Cargo',
    access: true
}, {
    permission: 'Empresa',
    access: true
}, {
    permission: 'Correo electrónico',
    access: true
}, {
    permission: 'Guardar contacto',
    access: true
}, {
    permission: 'VCard',
    access: true
}, {
    permission: 'Libre de publicidad',
    access: true
}, {
    permission: 'Cambiar URL',
    access: true
}, {
    permission: 'Tipos de perfil',
    access: ['public', 'private', 'vip']
}, {
    permission: 'Redes favoritas',
    access: true,
    limit: 999
}, {
    permission: 'Redes sociales favoritas obligatorias',
    access: ['website']
}, {
    permission: 'Redes sociales favoritas excluidas',
    access: ['facebook', 'twitter', 'linkedin']
}, {
    permission: "Redes sociales adicionales",
    access: true,
    limit: 999
}, {
    permission: 'Redes sociales adicionales obligatorias',
    access: []
}, {
    permission: 'Diseño',
    access: true
}, {
    permission: 'Tarjetas',
    access: true,
    limit: 5
}, {
    permission: 'Botones adicionales',
    access: true,
    limit: 999
}]

module.exports = {
    basic,
    pro,
    vip
}