import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Auth } from '../../shared/services/auth/auth.service';
import { LogoutComponent } from './logout.component';

describe("logout.component.ts", () => {
  let component: LogoutComponent;
  let target: ComponentFixture<LogoutComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [LogoutComponent],
        imports: [],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .overrideComponent(LogoutComponent, {
          set: {
            providers: [
              {
                provide: Auth,
                useClass: class {
                  clear = jasmine.createSpy("clear");
                }
              }
            ]
          }
        })
        .compileComponents();
    })
  );

  beforeEach(() => {
    target = TestBed.createComponent(LogoutComponent);

    component = target.componentInstance;
    // spyOn(target.debugElement.injector.get(Auth), "clear");

    target.detectChanges();
  });

  it("should clear localStorage", () => {
    expect(target.debugElement.injector.get(Auth).clear).toHaveBeenCalled();
  });
});
