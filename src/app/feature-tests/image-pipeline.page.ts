import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage, provideCloudinaryLoader } from '@angular/common';

/**
 * NgOptimizedImage with the built-in Cloudinary loader (Cloudinary's public `demo` cloud).
 * NgOptimizedImage generates srcset/sizes, width/height, lazy loading and a preload for
 * `priority`; the resizing / format negotiation (f_auto) is done by the image CDN.
 */
@Component({
  selector: 'ft-image-pipeline-page',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCloudinaryLoader('https://res.cloudinary.com/demo')],
  template: `
    <section class="p-6">
      <h1 class="text-xl font-semibold">Image pipeline</h1>
      <img id="ft-hero" ngSrc="sample.jpg" width="800" height="533" sizes="(max-width: 800px) 100vw, 800px" priority alt="Hero" />
      <div style="height: 3000px">Spacer so the next image starts offscreen.</div>
      <img id="ft-offscreen" ngSrc="dog.jpg" width="800" height="533" sizes="(max-width: 800px) 100vw, 800px" alt="Offscreen" />
    </section>
  `,
})
export class ImagePipelinePage {}
