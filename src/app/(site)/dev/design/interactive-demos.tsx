'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, Modal } from '@/components/ui/dialog';
import { Input, Select } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { PAYMENT_METHODS, SHIPPING_AGENCIES } from '@/config/business';

export function OverlayDemos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => setModalOpen(true)}>
        Abrir modal
      </Button>
      <Button variant="outline" onClick={() => setDrawerOpen(true)}>
        Abrir drawer
      </Button>
      <Button variant="ghost" onClick={() => toast('Añadido a la cesta: Hoodie Resiliencia (L)')}>
        Toast info
      </Button>
      <Button variant="ghost" onClick={() => toast('¡Docena completada! 15% aplicado', 'success')}>
        Toast éxito
      </Button>
      <Button variant="ghost" onClick={() => toast('No se pudo generar el PDF', 'error')}>
        Toast error
      </Button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Guía de tallas">
        <p className="text-fg-muted">
          Los modales usan el elemento nativo &lt;dialog&gt;: se cierran con Esc o haciendo clic
          fuera, atrapan el foco y lo devuelven al botón que los abrió.
        </p>
      </Modal>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Cesta de compras">
        <p className="text-fg-muted">Así se verá el panel lateral del carrito y el menú móvil.</p>
      </Drawer>
    </div>
  );
}

export function FormDemo() {
  return (
    <form className="grid gap-5 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
      <Input label="Nombre completo" placeholder="Ana Pérez" autoComplete="name" />
      <Input
        label="Cédula o RIF"
        placeholder="V-12345678"
        hint="Aparece en el comprobante de pedido"
      />
      <Input
        label="Teléfono"
        placeholder="0412-0000000"
        type="tel"
        error="Ingresa un teléfono venezolano válido"
        defaultValue="123"
      />
      <Select label="Agencia de envío" options={SHIPPING_AGENCIES} placeholder="Selecciona…" />
      <Select
        label="Método de pago"
        options={PAYMENT_METHODS}
        placeholder="Selecciona…"
        className="sm:col-span-2"
      />
    </form>
  );
}
