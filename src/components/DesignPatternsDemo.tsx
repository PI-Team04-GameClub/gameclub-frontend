/**
 * DEMO KOMPONENTA - Prikazuje sve tri paterna u akciji
 * 
 * Paterna koji se koriste:
 * 1. SINGLETON - Logger (jedna instanca za sve logove)
 * 2. ADAPTER - API adapter (kompatibilnost sučelja)
 * 3. OBSERVER - Event Manager (obavještavanje o događajima)
 */

import React, { useEffect, useState } from "react";
import logger from "../services/logger";
import {
  DataFormatAdapter,
  type GameData,
} from "../services/api_adapter";
import eventManager, {
  EventType,
  NotificationObserver,
  UserActivityObserver,
  GameObserver,
  ErrorObserver,
} from "../services/event_manager";
import { Box, VStack, HStack, Button, Text, useToast } from "@chakra-ui/react";

const DesignPatternsDemo: React.FC = () => {
  const toast = useToast();
  const [logs, setLogs] = useState<string[]>([]);
  const [eventHistory, setEventHistory] = useState<string[]>([]);

  // Inicijalizacija observera
  useEffect(() => {
    logger.info("=== DESIGN PATTERNS DEMO POČINJAO ===");

    // Registrira sve observere
    const notificationObserver = new NotificationObserver();
    const userActivityObserver = new UserActivityObserver();
    const gameObserver = new GameObserver();
    const errorObserver = new ErrorObserver();

    // Svaki observer se registrira na specifične događaje
    eventManager.subscribe(EventType.USER_LOGGED_IN, userActivityObserver);
    eventManager.subscribe(EventType.USER_LOGGED_OUT, userActivityObserver);
    eventManager.subscribe(EventType.GAME_CREATED, gameObserver);
    eventManager.subscribe(EventType.GAME_DELETED, gameObserver);
    eventManager.subscribe(EventType.NOTIFICATION, notificationObserver);
    eventManager.subscribe(EventType.ERROR, errorObserver);

    logger.info("Svi observeri su registrirani");

    return () => {
      logger.info("=== DEMO KOMPONENTA DEMONTIRANA ===");
    };
  }, []);

  // Ažurira UI s novim logovima
  const updateLogs = () => {
    const allLogs = logger.getLogs();
    setLogs(allLogs.map((log) => `[${log.level}] ${log.message}`));
  };

  // Ažurira UI s historijom događaja
  const updateEventHistory = () => {
    const history = eventManager.getEventHistory();
    setEventHistory(history.map((event) => `[${event.type}] ${JSON.stringify(event.data)}`));
  };

  // Demo 1: Singleton Logger
  const handleLoggerDemo = () => {
    logger.info("Demo 1: SINGLETON PATTERN - Logger");
    logger.warn("Ovo je warning poruka");
    logger.error("Ovo je error poruka");
    logger.debug("Ovo je debug poruka");

    updateLogs();
    toast({
      title: "Logger Demo",
      description: "Pogledaj console i logove ispod",
      status: "info",
      duration: 3000,
    });
  };

  // Demo 2: Adapter - Format konverzija
  const handleAdapterDemo = () => {
    logger.info("Demo 2: ADAPTER PATTERN - Format konverzija");

    try {
      // Primjer: JSON podataka
      const jsonGames: GameData[] = [
        { id: 1, title: "Counter-Strike 2", status: "active", createdAt: "2026-01-01" },
        { id: 2, title: "League of Legends", status: "active", createdAt: "2026-01-02" },
        { id: 3, title: "Valorant", status: "inactive", createdAt: "2025-12-25" },
      ];

      logger.info("Primjer 1: JSON → CSV");
      const csv = DataFormatAdapter.jsonToCsv(jsonGames);
      logger.info(`CSV rezultat:\n${csv}`);

      logger.info("Primjer 2: CSV → JSON");
      const jsonBack = DataFormatAdapter.csvToJson(csv);
      logger.info(`JSON rezultat: ${JSON.stringify(jsonBack)}`);

      logger.info("Primjer 3: JSON → XML");
      const xml = DataFormatAdapter.jsonToXml(jsonGames);
      logger.info(`XML rezultat:\n${xml}`);

      logger.info("Primjer 4: XML → JSON");
      const jsonFromXml = DataFormatAdapter.xmlToJson(xml);
      logger.info(`Konvertirano natrag u JSON: ${jsonFromXml.length} igara`);

      updateLogs();

      toast({
        title: "Adapter Demo",
        description: "Format konverzija uspješna - pogledaj logove",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      logger.error(`Adapter demo error: ${error}`);
      toast({
        title: "Greška",
        description: "Pogledaj logove za više informacija",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Demo 3: Observer Event Manager
  const handleObserverDemo = () => {
    logger.info("Demo 3: OBSERVER PATTERN - Event Manager");

    // Emituje razne događaje
    eventManager.emit(EventType.USER_LOGGED_IN, { userId: 123, username: "Matija" });
    eventManager.emit(EventType.GAME_CREATED, { gameId: 456, gameName: "Counter-Strike 2" });
    eventManager.emit(EventType.NOTIFICATION, { message: "Nova notifikacija!" });
    eventManager.emit(EventType.ERROR, { message: "Došlo je do greške" });

    updateEventHistory();
    updateLogs();

    toast({
      title: "Observer Demo",
      description: "Događaji su emitirani - pogledaj historiju",
      status: "success",
      duration: 3000,
    });
  };

  const handleClearLogs = () => {
    logger.clearLogs();
    eventManager.clearHistory();
    setLogs([]);
    setEventHistory([]);
    logger.info("Logovi i historija su obrisani");
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Text fontSize="3xl" fontWeight="bold" mb={2}>
            🎨 Design Patterns Demo
          </Text>
          <Text fontSize="md" color="gray.600">
            Demonstracija Singleton, Decorator i Observer paterna
          </Text>
        </Box>

        {/* Demo Buttons */}
        <HStack spacing={4} wrap="wrap">
          <Button colorScheme="blue" onClick={handleLoggerDemo} size="lg">
            1️⃣ Singleton - Logger
          </Button>
          <Button colorScheme="green" onClick={handleAdapterDemo} size="lg">
            2️⃣ Adapter - Format Konverzija
          </Button>
          <Button colorScheme="purple" onClick={handleObserverDemo} size="lg">
            3️⃣ Observer - Events
          </Button>
          <Button colorScheme="red" onClick={handleClearLogs} size="lg" variant="outline">
            🗑️ Očisti
          </Button>
        </HStack>

        {/* Logs Section */}
        <Box bg="white" p={6} rounded="lg" shadow="sm" flex={1}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            📋 Logger Logovi ({logs.length})
          </Text>
          <Box
            bg="gray.900"
            color="green.300"
            p={4}
            rounded="md"
            fontFamily="monospace"
            fontSize="sm"
            maxH="300px"
            overflowY="auto"
          >
            {logs.length === 0 ? (
              <Text color="gray.500">Nema logova...</Text>
            ) : (
              logs.map((log, idx) => (
                <Box key={idx} mb={1}>
                  {log}
                </Box>
              ))
            )}
          </Box>
        </Box>

        {/* Event History Section */}
        <Box bg="white" p={6} rounded="lg" shadow="sm" flex={1}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            📡 Event Historija ({eventHistory.length})
          </Text>
          <Box
            bg="gray.900"
            color="blue.300"
            p={4}
            rounded="md"
            fontFamily="monospace"
            fontSize="sm"
            maxH="300px"
            overflowY="auto"
          >
            {eventHistory.length === 0 ? (
              <Text color="gray.500">Nema događaja...</Text>
            ) : (
              eventHistory.map((event, idx) => (
                <Box key={idx} mb={1}>
                  {event}
                </Box>
              ))
            )}
          </Box>
        </Box>

        {/* Info Section */}
        <Box bg="blue.50" p={4} rounded="lg" border="2px" borderColor="blue.200">
          <Text fontWeight="bold" mb={2}>
            💡 O Paternima:
          </Text>
          <VStack align="start" spacing={2} fontSize="sm">
            <Text>
              <strong>Singleton:</strong> Logger.getInstance() vraća istu instancu svaki put
            </Text>
            <Text>
              <strong>Adapter:</strong> Konvertuje podatke između različitih formata (JSON, CSV, XML)
            </Text>
            <Text>
              <strong>Observer:</strong> EventManager notificira sve registrirane observere
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default DesignPatternsDemo;
