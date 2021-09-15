'use strict'

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');
const azure = require('azure-storage');
const guid = require('guid');
const config = require('../config');

exports.get = async (req, res, next) => {
  // Product.find({ active: true }, 'title price slug')
  // repository.get()
  //   .then(data => {
  //     res.status(200).send(data);
  //   }).catch(e => {
  //     res.status(400).send(e);
  //   });
  try {
    let data = await repository.get();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição'
    });
  }
}

exports.getBySlug = async (req, res, next) => {
  // Product.findOne({
  //   slug: req.params.slug,
  //   active: true
  // }, 'title description price slug tags')
  // repository.getBySlug(req.params.slug)
  //   .then(data => {
  //     res.status(200).send(data);
  //   }).catch(e => {
  //     res.status(400).send(e);
  //   });
  try {
    let data = await repository.getBySlug(req.params.slug);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição'
    });
  }
}

exports.getById = async (req, res, next) => {
  // Product.findById(req.params.id)
  // repository.getById(req.params.id)
  //   .then(data => {
  //     res.status(200).send(data);
  //   }).catch(400).send(e);

  try {
    const data = await repository.getById(req.params.id);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição'
    });
  }
}

exports.getByTag = async (req, res, next) => {
  // Product.find({
  //   tags: req.params.tag,
  //   active: true
  // }, 'title description price slug tags')
  // repository.getByTag(req.params.tag)
  //   .then(data => {
  //     res.status(200).send(data);
  //   }).catch(e => {
  //     res.status(400).send(e);
  //   });

  try {
    const data = await repository.getByTag(req.params.tag);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição'
    });
  }
}

exports.post = async (req, res, next) => {
  let contract = new ValidationContract();
  contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres');
  contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelo menos 3 caracteres');
  contract.hasMinLen(req.body.description, 3, 'A descrição deve conter pelo menos 3 caracteres');

  if (!contract.isValid()) {
    res.status(400).send(contract.errors()).end();
    return;
  }

  // var product = new Product(req.body);
  // product.save()
  // repository.createProduct(req.body)
  //   .then(x => {
  //     res.status(201).send({
  //       message: 'Produto cadastrado com sucesso!'
  //     });
  //   }).catch(e => {
  //     res.status(400).send({
  //       message: 'Falha ao cadastrar o produto', data: e
  //     });
  //   });

  try {
    // Cria o blob Service => Blob == arquivos
    const blobSvc = azure.createBlobService(config.containerConnectionString);

    let filename = guid.raw().toString() + '.jpg';
    let rawdata = req.body.image;
    let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer(matches[2], 'base64');

    // Salvar a imagem
    await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
      contentType: type
    }, function (error, result, response) {
      if (error) {
        filename = 'default-product.png'
      }
    });

    await repository.createProduct({
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      price: req.body.price,
      active: true,
      tags: req.body.tags,
      image: 'url da imagem' + finelame
    });
    res.status(201).send({
      message: 'Produto cadastrado com sucesso!'
    });
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição'
    });
  }
};

exports.put = async (req, res, next) => {
  // Product.findByIdAndUpdate(req.params.id, {
  //   $set: {
  //     title: req.body.title,
  //     description: req.body.description,
  //     price: req.body.price
  //   }
  // })
  // repository.updateProduct(req.params.id, req.body)
  //   .then(data => {
  //     res.status(201).send({
  //       message: 'Produto atualizado com sucesso!'
  //     });
  //   }).catch(e => {
  //     res.status(400).send({
  //       message: 'Falha ao atualizar produto',
  //       data: e
  //     });
  //   });

  try {
    const data = await repository.updateProduct(req.params.id, req.body);
    res.status(201).send({
      message: 'Produto atualizado com sucesso!'
    });
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição'
    });
  }
};

exports.deleted = async (req, res, next) => {
  // Product.findByIdAndRemove(req.params.id)
  // repository.deleteProduct(req.params.id)
  //   .then(data => {
  //     res.status(201).send({
  //       message: 'Produto removido com sucesso!'
  //     });
  //   }).catch(e => {
  //     res.status(400).send({
  //       message: 'Falha ao remover produto',
  //       data: e
  //     });
  //   });

  try {
    const data = await repository.deleteProduct(req.params.id);
    res.status(201).send({
      message: 'Produto removido com sucesso!'
    });
  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição'
    });
  }
}
