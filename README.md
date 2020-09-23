# babel-plugin-add-decorators-metadata
Add decorators metadata

# Installation
```sh
npm install hqjs@babel-plugin-add-decorators-metadata
```

# Usage
```json
{
  "plugins": [["hqjs@babel-plugin-add-decorators-metadata"]]
}
```

# Transformation
Transforms decorators into class metadata, takes care of wrapping `providers` property into an object. This transformations allow angular to use dependency injection.123

So the code
```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {CoreConfig} from './app.service';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    CoreConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
will turn into

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CoreConfig } from './app.service';
import { AppComponent } from './app.component';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [{
    provide: CoreConfig
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
AppModule.decorators = [{
  type: NgModule,
  args: [{
    declarations: [AppComponent],
    imports: [BrowserModule],
    providers: [{
      provide: CoreConfig
    }],
    bootstrap: [AppComponent]
  }]
}];
```
