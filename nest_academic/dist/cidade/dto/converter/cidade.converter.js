"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConverterCidade = void 0;
const cidade_entity_1 = require("../../entity/cidade.entity");
const cidade_response_1 = require("../response/cidade.response");
class ConverterCidade {
    static toCidade(cidadeRequest) {
        const cidade = new cidade_entity_1.Cidade();
        if (cidadeRequest.idCidade != null) {
            cidade.idCidade = cidadeRequest.idCidade;
        }
        cidade.nomeCidade = cidadeRequest.nomeCidade;
        cidade.codCidade = cidadeRequest.codCidade;
        return cidade;
    }
    static toCidadeResponse(cidade) {
        const cidadeResponse = new cidade_response_1.CidadeResponse();
        cidadeResponse.idCidade = cidade.idCidade ?? 0;
        cidadeResponse.codCidade = cidade.codCidade;
        cidadeResponse.nomeCidade = cidade.nomeCidade;
        return cidadeResponse;
    }
}
exports.ConverterCidade = ConverterCidade;
//# sourceMappingURL=cidade.converter.js.map