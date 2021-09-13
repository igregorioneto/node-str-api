'use strinct';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');

exports.post = async (req, res, next) => {
  let contract = new ValidationContract();
  contract.hasMinLen(req.body.name, 3, 'O título deve conter pelo menos 3 caracteres');
  contract.isEmail(req.body.email, 'O email deve conter pelo menos 3 caracteres');
  contract.hasMinLen(req.body.password, 3, 'A senha deve conter pelo menos 3 caracteres');

  if (!contract.isValid()) {
    res.status(400).send(contract.errors()).end();
    return;
  }

  try {
    await repository.createCustomer(req.body);
    res.status(200).send({
      message: 'Customer cadastrado com sucesso!'
    })
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição'
    });
  }
}