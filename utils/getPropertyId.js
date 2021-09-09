const getPropertyId = (url) => {
    const place = url.includes('quintoandar.com') ? 'quinto' : url.includes('loft.com.br') ? 'loft' : 'other'; 
    
    if(place === 'other') return null;

    const regexp = place === 'quinto' ? /imovel\/(.*[0-9])\// : /\/([a-z0-9]*)$/
    const [, propertyId] = url.match(regexp);
    return  {place, propertyId}
}

module.exports = { getPropertyId }