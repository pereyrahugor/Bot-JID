import "dotenv/config";
import { createBot, createProvider, createFlow, addKeyword, EVENTS } from "@builderbot/bot";
import { MemoryDB } from "@builderbot/bot";
import { BaileysProvider } from "builderbot-provider-sherpa";
import { typing } from "./utils/presence";
import { welcomeFlowTxt } from "./Flows/welcomeFlowTxt";
import { listarGrupos } from "./utils/listarGrupos";

/** Puerto en el que se ejecutará el servidor */
const PORT = process.env.PORT ?? "";
const ID_GRUPO_RESUMEN = process.env.ID_GRUPO_WS ?? "";

const userQueues = new Map();
const userLocks = new Map();

const adapterProvider = createProvider(BaileysProvider, {
    groupsIgnore: false,
    readStatus: false,
});


/**
 * Procesa el mensaje del usuario y ejecuta la acción correspondiente
 * @param ctx - El contexto del mensaje
 * @param param1 - Parámetros adicionales que incluyen flowDynamic, state, provider y gotoFlow
 * @returns El estado actualizado
 */
const processUserMessage = async (
    ctx,
    { flowDynamic, state, provider, gotoFlow }
) => {
    await typing(ctx, provider);
    try {
        // Comando especial para listar grupos (ahora para cualquier usuario)
        if (ctx.body === "#LISTAR_GRUPOS#") {
            const lista = await listarGrupos(provider, ctx.from);
            if (lista) console.log(lista); // Imprime la lista en consola
            await flowDynamic([{ body: "✅ Lista de grupos enviada a tu WhatsApp y mostrada en consola." }]);
            return state;
        }
        // No hacer nada más, el bot solo responde al comando de activación
        return state;
    } catch (error) {
        console.error("Error al procesar el mensaje del usuario:", error);
        return gotoFlow(welcomeFlowTxt);
    }
};

/**
 * Maneja la cola de usuarios, procesando los mensajes en orden
 * @param userId - El ID del usuario cuya cola se va a manejar
 */
const handleQueue = async (userId) => {
    const queue = userQueues.get(userId);

    if (userLocks.get(userId)) return;

    userLocks.set(userId, true);

    while (queue.length > 0) {
        const { ctx, flowDynamic, state, provider, gotoFlow } = queue.shift();
        try {
            await processUserMessage(ctx, { flowDynamic, state, provider, gotoFlow });
        } catch (error) {
            console.error(`Error procesando el mensaje de ${userId}:`, error);
        }
    }

    userLocks.set(userId, false);
    userQueues.delete(userId);
};

// Main function to initialize the bot and load Google Sheets data
const main = async () => {

    // Paso 4: Crear el flujo principal del bot
    const adapterFlow = createFlow([welcomeFlowTxt]);
    // Paso 5: Crear el proveedor de WhatsApp (Baileys)
    const adapterProvider = createProvider(BaileysProvider, {
                    version: [2, 3000, 1033834674],
                    groupsIgnore: false,
                    readStatus: false,
                    });
    // Paso 6: Crear la base de datos en memoria
    const adapterDB = new MemoryDB();
    // Paso 7: Inicializar el bot con los flujos, proveedor y base de datos
    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    // Paso 8: Iniciar el servidor HTTP en el puerto especificado
    httpServer(+PORT);
};

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

export { welcomeFlowTxt, handleQueue, userQueues, userLocks,
 };

main();