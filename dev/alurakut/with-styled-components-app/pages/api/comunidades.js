import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {

    if (request.method === "POST") {
        const TOKEN = '67a90022f02234227f13725b375f54';
        const client = new SiteClient(TOKEN);

        //Validar os dados antes de sair cadastrando
        const registroCriado = await client.items.create({
            itemType: "967634", // model ID extracted from Dato CMS
            ...request.body,
            //title: 'Comunidade de Teste',
            //imageUrl: 'http://placehold.it/300x300',
            //creatorSlug: 'milenasvieira'
        })
        console.log(registroCriado);

        response.json({
            dados: 'Algum dado qualquer',
            regitroCriado: registroCriado,
        })
        return;
    }
    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem.'
    })
}



    