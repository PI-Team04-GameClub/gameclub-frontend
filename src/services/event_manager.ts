/**
 * OBSERVER PATTERN - BEHAVIORAL
 * Obavještava pretplaćene objekte (subscribers) o promjenama
 * 
 * Kada koristiti:
 * • Publish-subscribe scenariji
 * • Event handling sustavi
 * • Reaktivne aplikacije
 */

import logger from "./logger";

/**
 * Sučelje za Observer - svaki observer mora implementirati update metodu
 */
interface Observer {
  update(eventType: string, data: any): void;
}

/**
 * Tipovi događaja koji se mogu observirati
 */
export enum EventType {
  USER_LOGGED_IN = "USER_LOGGED_IN",
  USER_LOGGED_OUT = "USER_LOGGED_OUT",
  GAME_CREATED = "GAME_CREATED",
  GAME_DELETED = "GAME_DELETED",
  TOURNAMENT_UPDATED = "TOURNAMENT_UPDATED",
  NOTIFICATION = "NOTIFICATION",
  ERROR = "ERROR",
}

/**
 * Subject - klasa koja upravlja observerima
 * Ovo je singleton pattern koji se koristi zajedno sa observer patternsom
 */
class EventManager implements Observer {
  private static instance: EventManager;
  private observers: Map<string, Observer[]> = new Map();
  private eventHistory: Array<{ type: string; data: any; timestamp: string }> = [];

  private constructor() {
    logger.info("EventManager inicijaliziran");
  }

  /**
   * Dohvaća jedinu instancu EventManager-a (Singleton)
   */
  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  /**
   * Registrira observer za određeni tip događaja
   */
  public subscribe(eventType: string, observer: Observer): void {
    if (!this.observers.has(eventType)) {
      this.observers.set(eventType, []);
    }
    this.observers.get(eventType)!.push(observer);
    logger.info(`Observer registriran za događaj: ${eventType}`);
  }

  /**
   * Uklanja observer iz određenog tipa događaja
   */
  public unsubscribe(eventType: string, observer: Observer): void {
    if (!this.observers.has(eventType)) return;

    const observers = this.observers.get(eventType)!;
    const index = observers.indexOf(observer);
    if (index > -1) {
      observers.splice(index, 1);
      logger.info(`Observer obrisan iz događaja: ${eventType}`);
    }
  }

  /**
   * Emitira događaj i obavještava sve pretplaćene observere
   */
  public emit(eventType: string, data: any): void {
    logger.info(`Emitovanje događaja: ${eventType}`);

    // Sprema u povijest događaja
    this.eventHistory.push({
      type: eventType,
      data,
      timestamp: new Date().toISOString(),
    });

    if (!this.observers.has(eventType)) {
      logger.warn(`Nema observera za događaj: ${eventType}`);
      return;
    }

    const observers = this.observers.get(eventType)!;
    observers.forEach((observer) => {
      try {
        observer.update(eventType, data);
      } catch (error) {
        logger.error(`Greška kod obavještavanja observera: ${error}`);
      }
    });
  }

  /**
   * Dohvaća sve registrirane observere za tip događaja
   */
  public getObservers(eventType: string): Observer[] {
    return this.observers.get(eventType) || [];
  }

  /**
   * Dohvaća povijest događaja
   */
  public getEventHistory(): Array<{ type: string; data: any; timestamp: string }> {
    return [...this.eventHistory];
  }

  /**
   * Čisti povijest događaja
   */
  public clearHistory(): void {
    this.eventHistory = [];
    logger.info("Povijest događaja obrisana");
  }

  /**
   * Implementacija Observer sučelja
   */
  public update(eventType: string, _data: any): void {
    logger.debug(`EventManager primio događaj: ${eventType}`);
  }
}

/**
 * 1. NotificationObserver
 * Šalje obavijesti korisnicima za sve događaje
 */
export class NotificationObserver implements Observer {
  public update(eventType: string, _data?: any): void {
    logger.info(`🔔 Obavijest: ${eventType}`);
    console.log(`🔔 [OBAVIJEST] ${eventType}`);
  }
}

/**
 * 2. GameActivityObserver
 * Prati sve igre-specifične događaje
 */
export class GameActivityObserver implements Observer {
  public update(eventType: string, _data?: any): void {
    if (eventType.includes("GAME")) {
      logger.info(`🎮 Igra aktivnost: ${eventType}`);
      console.log(`🎮 [IGRA] ${eventType}`);
    }
  }
}

/**
 * 3. UserActivityObserver
 * Prati sve korisničke događaje
 */
export class UserActivityObserver implements Observer {
  public update(eventType: string, _data?: any): void {
    if (eventType.includes("USER")) {
      logger.info(`👤 Korisnik aktivnost: ${eventType}`);
      console.log(`👤 [KORISNIK] ${eventType}`);
    }
  }
}

/**
 * 4. ErrorObserver
 * Prati greške i sistemske probleme
 */
export class ErrorObserver implements Observer {
  public update(eventType: string, _data: any): void {
    if (eventType === EventType.ERROR || eventType === EventType.TOURNAMENT_UPDATED) {
      logger.error(`❌ Greška: ${eventType}`);
      console.error(`❌ [GREŠKA] ${eventType}`);
    }
  }
}

// Exporta Event Manager kao singleton
export default EventManager.getInstance();
