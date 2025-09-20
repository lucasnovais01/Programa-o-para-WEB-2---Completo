"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConverterCidade = void 0;
const cidade_entity_1 = require("../../entity/cidade.entity");
const cidade_response_1 = require("../response/cidade.response");
const class_transformer_1 = require("class-transformer");
class ConverterCidade {
    static ConverterCidade(cidade) {
        throw new Error('Method not implemented.');
    }
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
        return (0, class_transformer_1.plainToInstance)(cidade_response_1.CidadeResponse, cidade, {
            excludeExtraneousValues: true,
        });
    }
    static toListCidadeResponse(cidades = []) {
        return (0, class_transformer_1.plainToInstance)(cidade_response_1.CidadeResponse, cidades, {
            excludeExtraneousValues: true,
        });
    }
}
exports.ConverterCidade = ConverterCidade;
//# sourceMappingURL=cidade.converter.js.map