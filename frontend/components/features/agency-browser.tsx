"use client";

import { useMemo, useState } from "react";
import { Clock3, MapPin, Search, Users } from "lucide-react";
import { QueueStatusBadge } from "@/components/features/queue-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { DemoAgency } from "@/lib/demo-data";

interface AgencyBrowserProps {
  agencies: DemoAgency[];
  banks: string[];
  cities: string[];
}

export function AgencyBrowser({ agencies, banks, cities }: AgencyBrowserProps) {
  const [search, setSearch] = useState("");
  const [bank, setBank] = useState("todos");
  const [city, setCity] = useState("todas");

  // Filtro apenas local: nesta etapa não existe Chamada à API.
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-MZ");
    return agencies.filter((agency) => {
      const matchesTerm =
        term.length === 0 ||
        `${agency.name} ${agency.bank} ${agency.city} ${agency.address}`
          .toLocaleLowerCase("pt-MZ")
          .includes(term);
      const matchesBank = bank === "todos" || agency.bank === bank;
      const matchesCity = city === "todas" || agency.city === city;
      return matchesTerm && matchesBank && matchesCity;
    });
  }, [agencies, search, bank, city]);

  function clearFilters() {
    setSearch("");
    setBank("todos");
    setCity("todas");
  }

  return (
    <div>
      <Card className="border-t-4 border-t-royal p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1.6fr_1fr_1fr]">
          <div className="space-y-2">
            <Label htmlFor="agency-search">Pesquisar agência</Label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-vivid"
              />
              <Input
                id="agency-search"
                type="search"
                placeholder="Nome, banco ou endereço"
                className="pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank-filter">Banco</Label>
            <Select
              id="bank-filter"
              value={bank}
              onChange={(event) => setBank(event.target.value)}
            >
              <option value="todos">Todos os bancos</option>
              {banks.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city-filter">Cidade</Label>
            <Select
              id="city-filter"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            >
              <option value="todas">Todas as cidades</option>
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted">
          {filtered.length} {filtered.length === 1 ? "agência encontrada" : "agências encontradas"}
        </p>
      </Card>

      {filtered.length === 0 ? (
        <Card className="mt-5 p-10 text-center">
          <p className="text-sm font-medium text-deep">Sem resultados</p>
          <p className="mt-1 text-sm text-muted">
            Experimente ajustar os filtros da pesquisa.
          </p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            Limpar filtros
          </Button>
        </Card>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((agency) => (
            <Card
              key={agency.id}
              className="flex flex-col p-5 transition-colors hover:border-vivid/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-vivid">{agency.bank}</p>
                  <h3 className="mt-1 text-base font-bold text-deep">
                    {agency.name}
                  </h3>
                </div>
                <QueueStatusBadge level={agency.level} />
              </div>

              <p className="mt-3 flex items-start gap-2 text-sm text-muted">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                {agency.address}, {agency.city}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 border-y border-line py-4">
                <div className="flex items-center gap-2">
                  <Clock3 aria-hidden="true" className="h-4 w-4 text-turquoise-ink" />
                  <div>
                    <p className="text-xs text-muted">Espera</p>
                    <p className="text-sm font-semibold text-deep">
                      {agency.waitMinutes === 0 ? "—" : `${agency.waitMinutes} min`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users aria-hidden="true" className="h-4 w-4 text-vivid" />
                  <div>
                    <p className="text-xs text-muted">A aguardar</p>
                    <p className="text-sm font-semibold text-deep">
                      {agency.peopleWaiting}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-muted">Serviços</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {agency.services.map((service) => (
                    <Badge key={service} variant="default">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="mt-auto pt-4 text-xs text-muted">
                A {agency.distanceKm.toLocaleString("pt-MZ")} km de distância
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
