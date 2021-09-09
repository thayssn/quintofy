const { loftAPI, propertyAPI, feeAPI } = require('./services/api.js')
const { getPropertyId } = require('./utils/getPropertyId.js');
const { addRow } = require('./services/google-spreadsheets')
const querystring = require('querystring');

const getInfoByPlace = async ({place, propertyId}) => {
    const info = {
        'loft': async () => {
            try{
                const { data } = await loftAPI.get(propertyId)
                console.log(data)

                const amenities = data.amenities.join(' - ')
        
                const fullAddress = `${data.address?.complexName} ${data.address?.streetType} ${data.address?.streetName}, ${data.address?.number} - ${data.address?.neighborhood}  ${data.address?.postalCode}, ${data.address?.city}`
    
                const approximatedLoanTranche = data.salePrice * 0.0075
                
                return {
                    'ID': data.id,
                    'Região': data.region?.name,
                    'Bairro': data.address?.neighborhood,
                    'Endereço': `${data.address?.streetType} ${data.address?.streetName}, ${data.address?.number}`,
                    'M2': data.area,
                    'Quartos': data.bedrooms,
                    'Banheiros': data.restrooms,
                    'Vaga': data.parkingSpots > 0,
                    'Andar': data.floor,
                    'Mobilidao': '',
                    'Nome do Condomínio': data.address?.complexName,
                    'Ano': data.builtYear,
                    'Instalações': amenities,
                    'Metrô': data.subwayShortestDistance < 1000,
                    'Preço': data.price,
                    'Entrada': data.price * 0.2,
                    'Parcela Apriximada': approximatedLoanTranche,
                    'Condomínio': data.complexFee,
                    'Parcela + Condomínio': data.complexFee + approximatedLoanTranche,
                    'Link': url,
                    'Mapa': `https://www.google.com/maps/search/${querystring.escape(fullAddress)}`
                }
            }catch(err){
                console.log(err)
                console.log('O imóvel não foi encontrado.')
            }
            
        },
        'quinto': async () => {
            const {data} = await propertyAPI.get(propertyId).catch(err => console.log(err))

            const installations = data.installations.filter(installation => installation.value === 'SIM').map(({text}) => text).join(' - ')
        
            const fullAddress = `${data.condominium?.name} ${data.address?.address}, ${data.address?.number} - ${data.address?.neighborhood}, ${data.address?.city}`

            const approximatedLoanTranche = data.salePrice * 0.0075
            
            const fee = await feeAPI.get(feeAPI.baseURL, {
                params: {
                    financedValue: data.salePrice,
                    baseValue: data.salePrice,
                    transactionDate: new Date().toISOString()
                }
            })
            
            const totalFee = fee.data.reduce((current, next )=> current + next.totalValue, 0)

            return {
                'ID': data.code,
                'Região': data.region?.name,
                'Bairro': data.neighborhood,
                'Endereço': `${data.address?.address}, ${data.address?.number}`,
                'M2': data.totalArea,
                'Quartos': data.bedrooms,
                'Banheiros': data.bathrooms,
                'Vaga': data.parkingSlots > 0,
                'Andar': data.floor,
                'Mobilidao': data.isFurnished,
                'Nome do Condomínio': data.condominium?.name,
                'Ano': data.condominium?.constructionYear,
                'Instalações': installations,
                'Metrô': data.nearSubway,
                'Preço': data.salePrice,
                'Entrada': data.salePrice * 0.2,
                'Taxas': totalFee,
                'Parcela Apriximada': '',
                'Condomínio': data.condominiumValue,
                'Parcela + Condomínio': '',
                'Link': url,
                'Mapa': `https://www.google.com/maps/search/${querystring.escape(fullAddress)}`
            }
        }
    }

    return await info[place]()
}

// const url = "https://www.quintoandar.com.br/imovel/893215899/comprar?utm_source=shared&utm_campaign=sale&utm_medium=copy_share"
const url = "https://loft.com.br/imovel/apartamento-venda-socorro-sao-paulo-3-quartos-80m2/13n5lxk"

async function main(){
    const {place, propertyId} = getPropertyId(url)
    
    console.log(place)
    
    if(!propertyId) return

    console.log(propertyId)

    const row = await getInfoByPlace({place, propertyId})
    
    addRow(row)
}

main()
