// app/src/utils/matchingEngineV1/familyRegistry.js
// Lookup helpers for the compact canonical family registry.

import {
  directionFamilyRegistryById,
  directionFamilyRegistryV1,
} from "../../data/directionFamilyRegistryV1.js";

export function getCanonicalFamilyById(familyId) {
  if (!familyId) return null;
  return directionFamilyRegistryById[String(familyId).trim()] || null;
}

export function getCanonicalFamilyRef(familyId) {
  return normalizeCanonicalFamilyRef(familyId);
}

export function hasCanonicalFamilyId(familyId) {
  return Boolean(getCanonicalFamilyById(familyId));
}

export function getCanonicalFamiliesBySpine(spineId) {
  if (!spineId) return [];
  return directionFamilyRegistryV1.filter((family) => family.spineId === spineId);
}

export function getCanonicalFamilySpine(familyId) {
  const family = getCanonicalFamilyById(familyId);
  if (!family) return null;

  return {
    spineId: family.spineId,
    spineName: family.spineName,
  };
}

export function familyBelongsToSpine(familyId, spineId) {
  const family = getCanonicalFamilyById(familyId);
  if (!family || !spineId) return false;
  return family.spineId === spineId;
}

export function getFamilyIdsBySpine(spineId) {
  return getCanonicalFamiliesBySpine(spineId).map((family) => family.familyId);
}

export function getFamiliesBySpineIds(spineIds = []) {
  const spineSet = new Set((spineIds || []).filter(Boolean));
  if (spineSet.size === 0) return [];

  return directionFamilyRegistryV1.filter((family) =>
    spineSet.has(family.spineId)
  );
}

export function normalizeCanonicalFamilyRef(familyId) {
  const family = getCanonicalFamilyById(familyId);

  if (!family) {
    return {
      familyId: familyId ?? null,
      familyName: null,
      exists: false,
    };
  }

  return {
    familyId: family.familyId,
    familyName: family.familyName,
    spineId: family.spineId,
    spineName: family.spineName,
    exists: true,
  };
}

export function getCanonicalFamilyCount() {
  return directionFamilyRegistryV1.length;
}

export const familyRegistry = {
  getCanonicalFamilyById,
  getCanonicalFamilyRef,
  hasCanonicalFamilyId,
  getCanonicalFamiliesBySpine,
  getCanonicalFamilySpine,
  familyBelongsToSpine,
  getFamilyIdsBySpine,
  getFamiliesBySpineIds,
  normalizeCanonicalFamilyRef,
  getCanonicalFamilyCount,
};
