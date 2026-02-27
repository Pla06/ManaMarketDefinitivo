import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../../common/interfaces';
import { cardService } from '../../../services/cardService';
import Swal from 'sweetalert2';
import './CardEdit.css';

export const CardEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    collection: '',
    rarity: '',
    type: '',
    price: 0,
    stock: 0,
    language: '',
    condition: '',
    imageUrl: ''
  });

  const [collections, setCollections] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollection, setNewCollection] = useState('');

  useEffect(() => {
    loadCollections();
    if (id) {
      loadCard();
    } else {
      setIsEditing(false);
    }
  }, [id]);

  const loadCollections = async () => {
    try {
      const data = await cardService.getCollections();
      setCollections(data.status);
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };

  const loadCard = async () => {
    try {
      const data = await cardService.getCard(id!);
      setFormData(data.status);
      setIsEditing(true);
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar',
        text: 'No se pudo cargar la información de la carta',
        confirmButtonText: 'Entendido'
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    if (!formData.collection || formData.collection.length < 2) {
      newErrors.collection = 'La colección es requerida';
    }
    if (!formData.rarity || formData.rarity.length < 2) {
      newErrors.rarity = 'La rareza es requerida';
    }
    if (!formData.type || formData.type.length < 2) {
      newErrors.type = 'El tipo es requerido';
    }
    if (formData.price < 0) {
      newErrors.price = 'El precio no puede ser negativo';
    }
    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }
    if (!formData.language || formData.language.length < 2) {
      newErrors.language = 'El idioma es requerido';
    }
    if (!formData.condition || formData.condition.length < 2) {
      newErrors.condition = 'El estado es requerido';
    }
    if (!formData.imageUrl || formData.imageUrl.length < 5) {
      newErrors.imageUrl = 'La URL de la imagen es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleAddCollection = () => {
    if (newCollection.trim() && !collections.includes(newCollection.trim())) {
      const updatedCollections = [...collections, newCollection.trim()].sort();
      setCollections(updatedCollections);
      setFormData(prev => ({
        ...prev,
        collection: newCollection.trim()
      }));
      setNewCollection('');
      setShowNewCollection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Revisa los campos obligatorios antes de continuar.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await cardService.updateCard(formData);
        await Swal.fire({
          icon: 'success',
          title: '¡Carta modificada!',
          text: 'La carta ha sido actualizada correctamente',
          confirmButtonText: 'Continuar'
        });
      } else {
        const { _id, ...createPayload } = formData;
        await cardService.addCard(createPayload);
        await Swal.fire({
          icon: 'success',
          title: '¡Carta creada!',
          text: 'La carta ha sido agregada correctamente',
          confirmButtonText: 'Continuar'
        });
      }
      navigate('/card/list');
    } catch (error) {
      const apiMessage = (error as { response?: { data?: { status?: string } } })?.response?.data?.status;
      console.error('Error guardando carta:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: apiMessage ?? (isEditing
          ? 'No se pudo actualizar la carta. Por favor, inténtalo de nuevo.'
          : 'No se pudo crear la carta. Por favor, inténtalo de nuevo.'),
        confirmButtonText: 'Entendido'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminará la carta de forma permanente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);
    try {
      await cardService.deleteCard(formData._id);
      await Swal.fire({
        icon: 'success',
        title: '¡Eliminada!',
        text: 'La carta ha sido eliminada correctamente',
        confirmButtonText: 'Continuar'
      });
      navigate('/card/list');
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la carta.',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid edit-container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8 my-4">
          <div className="card card-custom">
            <div className="card-header text-center bg-mtg-blue text-white">
              <h2 className="mb-0">{isEditing ? 'Editar carta' : 'Nueva carta'}</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="card-form">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Nombre de la carta</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        placeholder="Nombre"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="collection" className="form-label" id="collection-label">Colección</label>
                      {!showNewCollection ? (
                        <div>
                          <select
                            name="collection"
                            className={`form-select ${errors.collection ? 'is-invalid' : ''}`}
                            id="collection"
                            value={formData.collection}
                            onChange={handleChange}
                          >
                            <option value="">Selecciona una colección</option>
                            {collections.map(collection => (
                              <option key={collection} value={collection}>{collection}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm mt-2 w-100"
                            onClick={() => setShowNewCollection(true)}
                          >
                            + Crear nueva colección
                          </button>
                          {errors.collection && <div className="invalid-feedback">{errors.collection}</div>}
                        </div>
                      ) : (
                        <div>
                          <div className="d-flex gap-2">
                            <input
                              type="text"
                              className="form-control new-collection-input"
                              placeholder="Nombre de la colección"
                              value={newCollection}
                              onChange={(e) => setNewCollection(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddCollection();
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={handleAddCollection}
                              disabled={!newCollection.trim()}
                            >
                              ✓
                            </button>
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm mt-2 w-100"
                            onClick={() => {
                              setShowNewCollection(false);
                              setNewCollection('');
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="rarity" className="form-label">Rareza</label>
                      <input
                        type="text"
                        name="rarity"
                        className={`form-control ${errors.rarity ? 'is-invalid' : ''}`}
                        id="rarity"
                        placeholder="Rareza"
                        value={formData.rarity}
                        onChange={handleChange}
                      />
                      {errors.rarity && <div className="invalid-feedback">{errors.rarity}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="type" className="form-label">Tipo de carta</label>
                      <input
                        type="text"
                        name="type"
                        className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                        id="type"
                        placeholder="Tipo"
                        value={formData.type}
                        onChange={handleChange}
                      />
                      {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">Precio (€)</label>
                      <input
                        type="number"
                        name="price"
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                        id="price"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                      />
                      {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="stock" className="form-label">Stock disponible</label>
                      <input
                        type="number"
                        name="stock"
                        className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
                        id="stock"
                        placeholder="0"
                        min="0"
                        step="1"
                        value={formData.stock}
                        onChange={handleChange}
                      />
                      {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="language" className="form-label">Idioma</label>
                      <input
                        type="text"
                        name="language"
                        className={`form-control ${errors.language ? 'is-invalid' : ''}`}
                        id="language"
                        placeholder="Idioma"
                        value={formData.language}
                        onChange={handleChange}
                      />
                      {errors.language && <div className="invalid-feedback">{errors.language}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="condition" className="form-label">Estado</label>
                      <input
                        type="text"
                        name="condition"
                        className={`form-control ${errors.condition ? 'is-invalid' : ''}`}
                        id="condition"
                        placeholder="Estado"
                        value={formData.condition}
                        onChange={handleChange}
                      />
                      {errors.condition && <div className="invalid-feedback">{errors.condition}</div>}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">URL de la imagen</label>
                      <input
                        type="text"
                        name="imageUrl"
                        className={`form-control ${errors.imageUrl ? 'is-invalid' : ''}`}
                        id="imageUrl"
                        placeholder="https://"
                        value={formData.imageUrl}
                        onChange={handleChange}
                      />
                      {errors.imageUrl && <div className="invalid-feedback">{errors.imageUrl}</div>}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-secondary btn-lg px-4" onClick={() => navigate('/card/list')}>Cancelar</button>
                    {isEditing && (
                      <button type="button" className="btn btn-danger btn-lg px-4" onClick={handleDelete} disabled={isSubmitting}>
                        Eliminar
                      </button>
                    )}
                  </div>
                  <button type="submit" className="btn btn-success btn-lg px-5" disabled={isSubmitting}>
                    {isSubmitting ? 'Procesando...' : (isEditing ? 'Actualizar' : 'Crear carta')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
