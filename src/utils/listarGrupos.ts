// Utilidad para listar todos los grupos y sus JID usando el socket de Baileys
// Envía la lista al número admin y la imprime en consola

async function listarGrupos(provider: any, adminJid: string) {
    try {
        if (!provider || !provider.getInstance) {
            console.error("No se puede acceder al provider de Baileys");
            return;
        }
        const sock = await provider.getInstance();
        if (!sock.groupFetchAllParticipating) {
            console.error("El socket de Baileys no soporta groupFetchAllParticipating");
            return;
        }
        const chats = await sock.groupFetchAllParticipating();
        let lista = '📩 Mensaje recibido de :' + adminJid + '\n';
        lista += '📝 Mensaje de texto recibido\n';
        for (const [jid, group] of Object.entries(chats)) {
            const groupInfo = group as { subject?: string };
            lista += `Grupo: ${groupInfo.subject ?? 'Sin nombre'} - JID: ${jid}\n`;
        }
        console.log('Lista generada para enviar:', lista); // Log de depuración
        // Enviar la lista al chat donde se recibió el comando (solo si es privado o grupo)
        let jidDestino = '';
        if (typeof adminJid === 'string') {
            // Si el JID no tiene sufijo, asumimos que es un número y le agregamos el sufijo de usuario
            if (adminJid.endsWith('@s.whatsapp.net') || adminJid.endsWith('@g.us')) {
                jidDestino = adminJid;
            } else if (/^\d+$/.test(adminJid)) {
                jidDestino = adminJid + '@s.whatsapp.net';
            }
        }
        console.log('JID destino para enviar:', jidDestino); // Log de depuración
        if (jidDestino.endsWith('@s.whatsapp.net') || jidDestino.endsWith('@g.us')) {
            try {
                console.log('Enviando mensaje...'); // Log de depuración
                await sock.sendMessage(jidDestino, { text: lista });
                console.log('Mensaje enviado correctamente'); // Log de depuración
            } catch (err) {
                console.error('Error enviando la lista de grupos al usuario:', err);
            }
        } else {
            console.warn('JID de destino no válido para enviar mensaje (solo privado o grupo):', jidDestino);
        }
        return lista; // Retorna la lista generada
    } catch (err) {
        console.error('Error al listar grupos:', err);
        return null;
    }
}

export { listarGrupos };
