import {Component, inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ServiceCardService} from '../../../service/service-card.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card-edit',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './card-edit.component.html',
  styleUrl: './card-edit.component.css'
})
export class CardEditComponent implements OnInit{
  @Input("id") id!:string;
  editar = false;
  collectionList: string[] = [];
  isSubmitting = false;

  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly cardService: ServiceCardService = inject(ServiceCardService);
  private readonly router : Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  formCard : FormGroup = this.formBuilder.group({
    _id: [],
    name: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(120)]],
    collection: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(120)]],
    rarity: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)]],
    type: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    language: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(10)]],
    condition: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
    imageUrl: ['', [Validators.required,
      Validators.minLength(5),
      Validators.maxLength(500)]]
  })

  myNewCollection: FormGroup = this.formBuilder.group({
    newCollection:['']
  });


  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadCard();
  }

  get name():any {
    return this.formCard.get('name');
  }
  get collection():any {
    return this.formCard.get('collection');
  }
  get rarity():any {
    return this.formCard.get('rarity');
  }
  get type():any {
    return this.formCard.get('type');
  }
  get price():any {
    return this.formCard.get('price');
  }
  get stock():any {
    return this.formCard.get('stock');
  }
  get language():any {
    return this.formCard.get('language');
  }
  get condition():any {
    return this.formCard.get('condition');
  }

  get imageUrl():any {
    return this.formCard.get('imageUrl');
  }

  get newCollection():any {
    return this.myNewCollection.get('newCollection');
  }

  private loadCard() {
    if (this.id) {
      this.editar = true;
      this.cardService.getCard(this.id).subscribe({
        next:(data)=>{
          this.formCard.patchValue(data.status)
        },
        error:(err)=>{
          console.error('Error loading card', err);
          Swal.fire({
            icon: 'error',
            title: 'Error al cargar',
            text: 'No se pudo cargar la información de la carta',
            confirmButtonText: 'Entendido'
          });
        },
        complete:()=>{
          console.log('Card loaded successfully');
        }
      })
    }
    else {
      this.formCard.reset({
        price: 0,
        stock: 0
      });
      this.editar = false;
    }
    this.cardService.getCollections().subscribe({
      next:(data)=>{
        this.collectionList = data.status
      }
    })
  }

  addCard() {
    if (this.isSubmitting) {
      return;
    }

    if (this.formCard.invalid) {
      this.formCard.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Revisa los campos obligatorios antes de continuar.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (this.editar && this.formCard.valid){
      this.isSubmitting = true;
      this.cardService.updateCard(this.formCard.getRawValue()).subscribe(
        {
          next:(data)=>{
            Swal.fire({
              icon: 'success',
              title: '¡Carta modificada!',
              text: 'La carta ha sido actualizada correctamente',
              confirmButtonText: 'Continuar'
            }).then(() => {
              this.router.navigate(['/card/list']);
            });
          },
          error:(err)=>{
            console.error('Error updating card', err);
            this.isSubmitting = false;
            Swal.fire({
              icon: 'error',
              title: 'Error al modificar',
              text: 'No se pudo actualizar la carta. Por favor, inténtalo de nuevo.',
              confirmButtonText: 'Entendido'
            });
          },
          complete:()=> {
            this.isSubmitting = false;
          }
        }
      )
    } else
    if (!this.editar && this.formCard.valid)
    {
      this.isSubmitting = true;
      this.cardService.addCard(this.formCard.getRawValue()).subscribe(
        {
          next:(data)=>{
            Swal.fire({
              icon: 'success',
              title: '¡Carta creada!',
              text: 'La carta ha sido agregada correctamente',
              confirmButtonText: 'Continuar'
            }).then(() => {
              this.router.navigate(['/card/list']);
            });
          },
          error:(err)=>{
            console.error('Error creating card', err);
            this.isSubmitting = false;
            Swal.fire({
              icon: 'error',
              title: 'Error al crear',
              text: 'No se pudo crear la carta. Por favor, inténtalo de nuevo.',
              confirmButtonText: 'Entendido'
            });
          },
          complete:()=> {
            this.isSubmitting = false;
          }
        }
      )
    }
  }

  addNewCollection() {
    const value = (this.newCollection.value ?? '').trim();
    if (!value) {
      return;
    }
    if (!this.collectionList.includes(value)) {
      this.collectionList.push(value);
    }
    this.formCard.patchValue({ collection: value });
    this.collection?.markAsDirty();
    this.collection?.markAsTouched();
    this.myNewCollection.reset();
  }

  deleteCard() {
    if (!this.id || this.isSubmitting) {
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isSubmitting = true;
        this.cardService.deleteCard(this.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Carta eliminada!',
              text: 'La carta ha sido eliminada correctamente',
              confirmButtonText: 'Continuar'
            }).then(() => {
              this.router.navigate(['/card/list']);
            });
          },
          error: (err) => {
            console.error('Error deleting card', err);
            this.isSubmitting = false;
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: 'No se pudo eliminar la carta. Por favor, inténtalo de nuevo.',
              confirmButtonText: 'Entendido'
            });
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      }
    });
  }
}
