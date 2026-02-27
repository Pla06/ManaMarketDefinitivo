import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { CartStateService } from '../../../service/cart-state.service';
import { RouterLink, Router } from '@angular/router';
import { map, firstValueFrom } from 'rxjs';
import { ServiceCardService } from '../../../service/service-card.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart-page',
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {
  private readonly cartState = inject(CartStateService);
  private readonly cardService = inject(ServiceCardService);
  private readonly router = inject(Router);

  readonly items$ = this.cartState.items$;
  readonly total$ = this.cartState.items$.pipe(
    map((items) => items.reduce((sum, item) => sum + item.card.price * item.quantity, 0))
  );

  isProcessing = false;

  updateQuantity(cardId: string, value: string): void {
    const quantity = Number.parseInt(value, 10);
    if (!Number.isFinite(quantity)) {
      return;
    }
    this.cartState.updateQuantity(cardId, quantity);
  }

  remove(cardId: string): void {
    this.cartState.removeCard(cardId);
  }

  clear(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminarán todas las cartas del carrito',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, vaciar carrito',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartState.clear();
        Swal.fire({
          icon: 'success',
          title: '¡Carrito vaciado!',
          text: 'Se han eliminado todas las cartas del carrito',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  async checkout(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      // Obtener los items actuales del carrito
      const items = await firstValueFrom(this.items$);

      if (items.length === 0) {
        await Swal.fire({
          icon: 'warning',
          title: 'Carrito vacío',
          text: 'No hay cartas en el carrito para procesar',
          confirmButtonText: 'Entendido'
        });
        this.isProcessing = false;
        return;
      }

      // Procesar cada item del carrito
      for (const item of items) {
        try {
          // Obtener la carta actual del backend
          const response = await firstValueFrom(this.cardService.getCard(item.card._id));
          const currentCard = response.status;

          // Verificar que hay suficiente stock
          if (currentCard.stock < item.quantity) {
            await Swal.fire({
              icon: 'error',
              title: 'Stock insuficiente',
              text: `No hay suficiente stock de ${currentCard.name}. Stock disponible: ${currentCard.stock}`,
              confirmButtonText: 'Entendido'
            });
            this.isProcessing = false;
            return;
          }

          // Actualizar el stock
          const updatedCard = {
            ...currentCard,
            stock: currentCard.stock - item.quantity
          };

          // Enviar la actualización al backend
          await firstValueFrom(this.cardService.updateCard(updatedCard));
        } catch (error) {
          console.error(`Error al actualizar ${item.card.name}:`, error);
          await Swal.fire({
            icon: 'error',
            title: 'Error al procesar',
            text: `Error al procesar ${item.card.name}. Por favor, inténtalo de nuevo.`,
            confirmButtonText: 'Entendido'
          });
          this.isProcessing = false;
          return;
        }
      }

      // Si todo fue exitoso, vaciar el carrito
      this.cartState.clear();
      await Swal.fire({
        icon: 'success',
        title: '¡Compra realizada con éxito!',
        text: 'El stock ha sido actualizado correctamente',
        confirmButtonText: 'Continuar'
      });
      
      // Redirigir al listado de cartas
      this.router.navigate(['/card/list']);
    } catch (error) {
      console.error('Error en el proceso de checkout:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al procesar tu compra. Por favor, inténtalo de nuevo.',
        confirmButtonText: 'Entendido'
      });
    } finally {
      this.isProcessing = false;
    }
  }
}
